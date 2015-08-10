var valida = false;

function le_nota_nfe(chave){

cnpj = "00762956000120";

tamanho = chave.length;

cnpj_chave = chave.substr(6,14);
compara = cnpj.localeCompare(cnpj_chave);

if (tamanho==44) {
	if (compara==0) 
		{
		valida = 1;
		document.formulario.fnfe.value = chave.substr(28,34);
		}
		else {
			valida = false;
			texto_alerta = "Emissor NFe não Autorizado!";
			alert(texto_alerta);
		}
	}
	else {
		valida = false;
		texto_alerta = "Chave de Acesso Invalida";
		alert(texto_alerta);
	}
}

function le_nota(qrcode){


document.formulario.fnatureza.value = qrcode.substring(10,qrcode.indexOf(' - Nfe'));

document.formulario.fnfe.value = qrcode.substring(qrcode.indexOf('Nfe')+5,qrcode.indexOf(' - Serie'));

document.formulario.serie.value = qrcode.substring(qrcode.indexOf('Serie')+7, qrcode.indexOf(' - Destino'));

document.formulario.fdestino.value = qrcode.substring(qrcode.indexOf('Destino')+16,qrcode.indexOf(' - Transportadora'));

document.formulario.ftransportadora.value = qrcode.substring(qrcode.indexOf('Transportadora')+23,qrcode.length);


}


function validacnpj(str) {

	cnpj = str;
	texto_alerta = "CNPJ INVALIDO!";
    	var numeros, digitos, soma, i, resultado, pos, tamanho, digitos_iguais;
    digitos_iguais = 1;
    if (cnpj.length < 14 && cnpj.length < 15)
	{	
		alert(texto_alerta);
        	return false;
	}
    for (i = 0; i < cnpj.length - 1; i++)
        if (cnpj.charAt(i) != cnpj.charAt(i + 1))
    {
        digitos_iguais = 0;
        break;
    }
    if (!digitos_iguais)
    {
        tamanho = cnpj.length - 2
        numeros = cnpj.substring(0,tamanho);
        digitos = cnpj.substring(tamanho);
        soma = 0;
        pos = tamanho - 7;
        for (i = tamanho; i >= 1; i--)
        {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2)
                pos = 9;
        }
        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado != digitos.charAt(0))
		{
		alert(texto_alerta);
	        return false;
		}
        tamanho = tamanho + 1;
        numeros = cnpj.substring(0,tamanho);
        soma = 0;
        pos = tamanho - 7;
        for (i = tamanho; i >= 1; i--)
        {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2)
                pos = 9;
        }
        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado != digitos.charAt(1))
		{
		alert(texto_alerta);
            	return false;
		}
        return true;
    }
    else
	{
	alert(texto_alerta);
        return false;
	}
}

function validatransportadora(){
entrada = document.formulario.ftransportadora.value.substring(0,14);
valida = validacnpj(entrada);
}

function validadestino(){

	entrada = document.formulario.fdestino.value.substring(0,14);
	valida = validacnpj(entrada);
	validatransportadora();

}


function processaDados() {

	Lote = document.getElementById("texto").value;

	for (i=0;i<Lote.lastIndexOf(String.fromCharCode(10));i++) {
		Lote = Lote.replace(String.fromCharCode(10),"");
		Lote = Lote.replace(String.fromCharCode(13),"");
		}

	for (i=0;i<Lote.lastIndexOf(" ");i++) {
		Lote = Lote.replace(" ","");
		}

	document.getElementById("texto").value = Lote;
	document.getElementById("dados").value = Lote;
	
	contador = 0;
}

function validaArquivo(){

	var tamanho = 0;
	var final = 0;
	var Lote = "";
	var num_campos = 1;
	var valido = 1;

	processaDados();
	Lote = document.getElementById("texto").value;

	tamanho = Lote.length;
	final = Lote.lastIndexOf(";");
		
	for (i=0;i<final;i++) {
		if(Lote.indexOf(";",i)>0) {
			contador++;
			i = Lote.indexOf(";",i);
		} else {valido = -1;}
	}

	if(contador%num_campos!=0) {valido = -1;}

	if(valido>0)
		{
		document.formulario.registros.value = contador/num_campos;
		document.formulario.campos.value = num_campos;
		chama_suporte();
		} else {
			texto_alerta = "Arquivo com Erro";
			alert(texto_alerta);
			}

	document.formulario.registros.value = contador/num_campos;
	document.formulario.campos.value = num_campos;
}


function envio(){

texto_alerta = "Dados Invalidos!";


if (document.location.href.indexOf("recebimento")>0)
	{
	valida = true;
	} else {
		validadestino();
		if (document.formulario.fdestino.value=="") {valida = false;}
		if (document.formulario.ftransportadora.value=="") {valida = false;}
		if (document.formulario.fnatureza.value=="") {valida = false;}
		}

if (valida) {
		parent.VID.formulario.submit();

		vid = document.formulario.fid.value;
		document.formulario.reset();
		document.getElementById("texto").value = "";
		document.formulario.fid.value = vid;
		
	} else {alert(texto_alerta);}

}