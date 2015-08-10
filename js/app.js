var resultDiv;
document.addEventListener("deviceready", identifica, false);


function separa(n) {

separador = String.fromCharCode(29);
tamanho = n.length;
GTIN = "";
reg_anvisa = "";
serial = "";
validade = "";
lote = "";
identificador = "";

if (n.indexOf(";")>0) {

	reg_anvisa = n.substring(7,20);
	n = n.substring(20,n.length);
	document.formulario.fanvisa.value = reg_anvisa;

	lote = n.substring(5,n.indexOf("validade:"));
	n = n.substring(n.indexOf("validade:"),n.length);
	document.formulario.flote.value = lote;

	validade = n.substring(9,n.indexOf("caixa:"));
	n = n.substring(n.indexOf("caixa:"),n.length);
	document.formulario.fvalidade.value = validade;

	identificador = n.substring(6,n.indexOf("seriais:"));
	n = n.substring(n.indexOf("seriais:"),n.length);
	document.formulario.fserial.value = identificador;

	seriais = n.substring(8,n.lenght);
	document.getElementById("texto").value = seriais;

	}

else {	

	for (i=0;i<4;i++) {
		if (n.substring(0,1)==separador) {n = n.substring(1,n.length);}
		if (i==0) {
			campo = n.substring(0,3);
			}
			else
			{
			campo = n.substring(0,2);
			}
		fim_de_campo = n.indexOf(separador);
		if(fim_de_campo<0){fim_de_campo = n.length;}
		switch(campo)
			{
			case "01":
			GTIN = n.substring(2,16);
			n = n.substring(16,n.length);
			break;
		case "21":
			serial = n.substring(2,fim_de_campo);
			document.formulario.fserial.value = serial;
			document.getElementById("texto").value = document.getElementById("texto").value+serial+";"
			n = n.substring(fim_de_campo,n.length);
			break;
		case "17":
			validade = n.substring(2,8);
			validade = n.substring(6,8)+"/"+n.substring(4,6)+"/"+n.substring(2,4);
			document.formulario.fvalidade.value = n.substring(4,6)+"/"+n.substring(2,4);
			n = n.substring(8,n.length);
			break;
		case "10":
			lote = n.substring(2,fim_de_campo);
			document.formulario.flote.value = lote;
			n = n.substring(fim_de_campo,n.length);
			break;
		case "713":
			reg_anvisa = n.substring(3,fim_de_campo);
			n = n.substring(fim_de_campo,n.length);
			document.formulario.fanvisa.value = reg_anvisa;
			break;


		default:
			texto_alerta = "Este não é um código válido!";
			alert(texto_alerta);
			i=10;
			break;
			}
		}

}

}



function startScan() {

	var scanner = cordova.require("cordova/plugin/BarcodeScanner");
	var aux = "";

	scanner.scan(
		function (result) {
						
			aux = result.text;
			if(result.format == 'DATA_MATRIX')
				{
				separa(aux);
				}
				else
					{
					le_nota(aux);
					}
		}, 
		function (error) {
			alert("Scanning failed: " + error);
		}
	);

}

function identifica() {

document.formulario.fid.value = 'Plataforma: '+ device.platform + ' - ' + 'UUID: '+ device.uuid;

    }