<?php

$cnpj_licenca = "00762956000120";
$empresa = "bbraun";
$caminho = "../../".$empresa."/";

$sucesso = 0;
$falha = 0;

$conteudo = "";
$registro = "";
$distribuidor = "";
$zona = "";
$embarque = "";
$auxiliar = chr(39);
$id = "1";
$origem = $cnpj_licenca;

$conteudo = stripslashes($_POST["conteudo"]);
$campos = $_POST["campos"];
$dados = explode(";",$_POST["dados"]);
$registros = $_POST["registros"];
$contador = $registros*$campos;

$anvisa = $_POST["fanvisa"];
$identificador = $_POST["fserial"];
$lote = $_POST["flote"];
$validade = $_POST["fvalidade"];//$validade = str_replace("/","",$validade);
$destino = $_POST["fdestino"];
$transportadora = $_POST["ftransportadora"];
$nfe = $_POST["fnfe"];
$natureza = $_POST["fnatureza"];
$id = $_POST["fid"];


//define formato de data
date_default_timezone_set("America/Sao_Paulo");

//verifica se licenca e valida
$licenca = "../licencas/".$id.".lic";
$licenca = str_replace("Plataforma: ","",$licenca);
$licenca = str_replace(" - UUID: ","",$licenca);

if(1==1) {

	for ($x=0; $x<$contador; $x++)
  		{

		if (!($x<$campos-1))
			{

			$alfa = $x%$campos;

			if ($alfa==0)
				{

				$serial = $dados[$x];


				$endereco = $anvisa."/".$lote."/".$serial;

				$FILE = $caminho.$endereco.".vid";

				//verifica se IUM existe
				if(file_exists($FILE)) {

					$fp = fopen($FILE, "r");
					$historico = fread($fp,filesize($FILE));

					//verifica se usuario e o real destinatario da custodia
					if(strrpos($historico,"Origem:")>0) {
						$origem_anterior = substr($historico,(strrpos($historico,"Origem:")+8),14);
						$destino_anterior = substr($historico,(strrpos($historico,"Destino:")+9),14);
						if($destino_anterior!=$cnpj_licenca) {
							$endereco = date("d/m/Y - h:i:sa")." - ".$endereco." - Recebimento cnpj inconsistente: ".$cnpj_licenca." - IP: ".$_SERVER["REMOTE_ADDR"]." - HOST: ".$_SERVER["REMOTE_HOST"]." - PORT: ".$_SERVER["REMOTE_PORT"].chr(10).chr(13)."\r\n";
							$FILE2 = $caminho."alertas/log_de_erros.txt";
							$fp2 = fopen($FILE2, "a+");
							fwrite($fp2, $endereco);
							fclose($fp2);
							fclose($fp);
							exit("Voce nao possui a custodia deste item! Atencao: Esta tentativa de acesso foi identificada e registrada. O uso indevido de dispositivos e licencas, assim como a tentativa de acesso nao autorizado configuram infracao prevista no codigo penal brasileiro e estao sujeitas a acoes judiciais.");
							}

						//verifica se o item esta disponivel para recebimento
						if(substr($historico,(strrpos($historico,"Natureza:")+10),3)!="(3)") {
							$endereco = date("d/m/Y - h:i:sa")." - ".$endereco." - Recebimento sem Remessa: ".$cnpj_licenca." - IP: ".$_SERVER["REMOTE_ADDR"]." - HOST: ".$_SERVER["REMOTE_HOST"]." - PORT: ".$_SERVER["REMOTE_PORT"].chr(10).chr(13)."\r\n";
							$FILE2 = $caminho."alertas/log_de_erros.txt";
							$fp2 = fopen($FILE2, "a+");
							fwrite($fp2, $endereco);
							fclose($fp2);
							fclose($fp);
							exit("Nao e possivel receber este item pois nao existe registro de envio! Entre em contato com seu fornecedor. Atencao: Esta tentativa de acesso foi identificada e registrada. O uso indevido de dispositivos e licencas, assim como a tentativa de acesso nao autorizado configuram infracao prevista no codigo penal brasileiro e estao sujeitas a acoes judiciais.");
							}

						//ajusta natureza do recebimento conforme natureza da remessa
						if(substr($historico,(strrpos($historico,"Natureza:")+10),(strrpos($historico,"Data")-(strrpos($historico,"Natureza:")+13)))=="(3) entrega - (1) venda") {
							$natureza = "(2) recebimento - (1) compra";
							}
							else {
								$natureza = substr($historico,(strrpos($historico,"Natureza:")+10),(strrpos($historico,"Data")-(strrpos($historico,"Natureza:")+13)));
								$natureza = str_replace("(3) entrega","(2) recebimento",$natureza);
							}
						}
						else {
							$endereco = date("d/m/Y - h:i:sa")." - ".$endereco." - Recebimento sem Remessa: ".$cnpj_licenca." - IP: ".$_SERVER["REMOTE_ADDR"]." - HOST: ".$_SERVER["REMOTE_HOST"]." - PORT: ".$_SERVER["REMOTE_PORT"].chr(10).chr(13)."\r\n";
							$FILE2 = $caminho."alertas/log_de_erros.txt";
							$fp2 = fopen($FILE2, "a+");
							fwrite($fp2, $endereco);
							fclose($fp2);
							fclose($fp);

							exit("Item nao disponivel para recebimento. Entre em contato com seu fornecedor. Atencao: Esta tentativa de acesso foi identificada e registrada. O uso indevido de dispositivos e licencas, assim como a tentativa de acesso nao autorizado configuram infracao prevista no codigo penal brasileiro e estao sujeitas a acoes judiciais.");
						}
					fclose($fp);
					}	

				//prepara conteudo para gravacao
				$conteudo2 =  "Evento: ".str_pad(time(), 12, "0", STR_PAD_LEFT)."\r\n Natureza: ".$natureza."\r\n Data Ocorrencia: ".date("d/m/Y - h:i:sa")." - ID: ".$id."\r\n -----------------------------------------------------------\r\n";

				if(file_exists($FILE)) {
					$fp = fopen($FILE, "a+");

					//faz gravacao e registra ocorrencia de eventual falha
					if(!fwrite($fp, $conteudo2)) {
						$endereco = date("d/m/Y - h:i:sa")." - Falha ao gravar registro - ".$endereco."\r\n";
						$FILE2 = $caminho."alertas/log_de_erros.txt";
						$fp2 = fopen($FILE2, "a+");
						fwrite($fp2, $endereco);
						fclose($fp2);
						$falha = $falha+1;
						}
						else {
							$sucesso = $sucesso+1;
						}
					fclose($fp);
					}
					else {
						//regista tentativa de gravacao em registro inexistente
						$endereco = date("d/m/Y - h:i:sa")." - ".$endereco." - IP: ".$_SERVER["REMOTE_ADDR"]." - HOST: ".$_SERVER["REMOTE_HOST"]." - PORT: ".$_SERVER["REMOTE_PORT"].chr(10).chr(13)."\r\n";
						$FILE2 = $caminho."alertas/log_de_erros.txt";
						$fp2 = fopen($FILE2, "a+");
						fwrite($fp2, $endereco);
						fclose($fp2);
						$falha = $falha+1;
						}

				}
			}
  		} 
	if($sucesso==$contador) {exit("Operacao Efetuada com 100% de sucesso!");}
	if($sucesso!=$contador) {exit("Operacao Efetuada com ".$falha." erros e ".$sucesso." registros bem sucedidos");}
	}

//registra tentativa de acesso nao autorizado
$licenca = date("d/m/Y - h:i:sa")." - ".$licenca." - IP: ".$_SERVER["REMOTE_ADDR"]." - HOST: ".$_SERVER["REMOTE_HOST"]." - PORT: ".$_SERVER["REMOTE_PORT"].chr(10).chr(13)."\r\n";
$FILE2 = $caminho."alertas/log_de_erros.txt";
$fp2 = fopen($FILE2, "a+");
fwrite($fp2, $licenca);
fclose($fp2);
exit("Dispositivo nao licenciado! Atencao: Esta tentativa de acesso foi identificada e registrada. O uso indevido de dispositivos e licencas, assim como a tentativa de acesso nao autorizado configuram infracao prevista no codigo penal brasileiro e estao sujeitas a acoes judiciais.");


?>
