var app = angular.module('phonecatApp', ['ui.grid', 'ui.grid.selection', 'ui.grid.exporter']);


app.controller('MainCtrl', MainCtrl);



function MainCtrl($scope) {
    $scope.data = [];


    $scope.gridOptions = {

        enableGridMenu: true,
        enableSelectAll: true,
        exporterCsvFilename: 'myFile.csv',
        exporterPdfDefaultStyle: {
            fontSize: 9
        },
        exporterPdfTableStyle: {
            margin: [30, 30, 30, 30]
        },
        exporterPdfTableHeaderStyle: {
            fontSize: 10,
            bold: true,
            italics: true,
            color: 'red'
        },
        exporterPdfHeader: {
            text: "My Header",
            style: 'headerStyle'
        },
        exporterPdfFooter: function (currentPage, pageCount) {
            return {
                text: currentPage.toString() + ' of ' + pageCount.toString(),
                style: 'footerStyle'
            };
        },
        exporterPdfCustomFormatter: function (docDefinition) {
            docDefinition.styles.headerStyle = {
                fontSize: 22,
                bold: true
            };
            docDefinition.styles.footerStyle = {
                fontSize: 10,
                bold: true
            };
            return docDefinition;
        },
        exporterPdfOrientation: 'portrait',
        exporterPdfPageSize: 'LETTER',
        exporterPdfMaxGridWidth: 500,
        exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
        exporterExcelFilename: 'myFile.xlsx',
        exporterExcelSheetName: 'Sheet1',
        data: "$ctrl.data"
    };


    this.uploadFile = function (event) {

        var files = event.target.files;
        console.log(files[0]);
        this.leerExcel(files[0]);
    }
};



app.directive('customOnChange', function () {
    return {
        restrict: 'A',
        scope: {
            data: '='
        },
        link: function (scope, element, attrs) {
            var onChangeHandler = scope.$eval(attrs.customOnChange);
            scope.informeFinal = [];
            element.on('change', function (event) {
                var files = event.target.files;


                scope.data = scope.parseExcel(files[0]);
            });




            scope.parseExcel = function (file) {
                var reader = new FileReader();

                reader.onload = function (e) {
                    var data = e.target.result;
                    var workbook = XLSX.read(data, {
                        type: 'binary'
                    });
                    workbook.SheetNames.forEach(function (sheetName) {
                        // Here is your object
                        var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                        var json_object = JSON.stringify(XL_row_object);

                        json_object = JSON.parse(json_object);



                        var clave = document.getElementById('clave').value;
                        var column = document.getElementById('columna').value;
                        json_object.forEach(function (element) {
                            //console.log(element[column]);
                            scope.informeFinal.push({
                                'identificador': element[clave],
                                peso: String(scope.buscarEnCadena(element[column], 'peso')),
                                talla: String(scope.buscarEnCadena(element[column], 'talla')),
                                sistolica: String(scope.buscarEnCadena(element[column], 'sistolica')),
                                diastolica: String(scope.buscarEnCadena(element[column], 'diastolica')),
                                pulso: String(scope.buscarEnCadena(element[column], 'pulso')),
                                FR: String(scope.buscarEnCadena(element[column], 'FR')),
                                SMC: String(scope.buscarEnCadena(element[column], 'SMC')),
                                Temp: String(scope.buscarEnCadena(element[column], 'Temp')),
                                abdominal : String(scope.buscarEnCadena(element[column], 'abdominal')),
                            });

                        });


                        // jQuery( '#xlx_json' ).val( JSON.stringify(InformeFinal) );

                        scope.data = scope.informeFinal;
                        scope.$apply();

                        /*alasql.promise('SELECT * INTO XLSX("restest280b.xlsx",{headers:true}) FROM ?', [scope.informeFinal])
                            .then(function (data) {
                                console.log('Data saved');
                            }).catch(function (err) {
                                console.log('Error:', err);
                            });
                        s*/
                    });
                    return scope.data;
                };

                reader.onerror = function (ex) {
                    console.log(ex);
                };

                reader.readAsBinaryString(file);
            };



            /**
             * Esta función permite hallar una unidad de medida en un párrafo
             */
            scope.buscarEnCadena = function (texto, tipo) {
                var result = [];
                //var  talla = new RegExp(/(peso: |talla: |altura: )+[-]{0,1}[\d]*[\.]{0,1}[\d]+ (cm|kg)+/g);
                if (texto != undefined) {


                    switch (tipo) {
                        case 'peso':
                            result = scope.buscarPeso(texto);
                            break;
                        case 'talla':
                            result = scope.buscarTalla(texto);
                            break;
                        case 'sistolica':
                            result = scope.buscarSistolica(texto);
                            break;
                        case 'diastolica':
                            result = scope.buscarDiastolica(texto);
                            break;
                        case 'pulso':
                            result = scope.buscarPulso(texto);
                            break;
                        case 'FR':
                            result = scope.buscarFR(texto);
                            break;
                        case 'SMC':
                            result = scope.buscarSMC(texto);
                            break;
                        case 'Temperatura':
                            result = scope.buscarTemp(texto);
                            break;
                        case 'abdominal':
                            result = scope.buscarAbdominal(texto);
                            break;
                        default:

                    }
                    return result;




                } else {
                    result = []
                }


                return result;
            };

            /**
             * 
             */
            scope.buscarPeso = function (texto) {
                var peso = new RegExp(/[-]{0,1}[\d]*[\.|,]{0,1}[\d]+ (kg|Kg|KG)+/g);
                var result = texto.match(peso);
                var pesoSoloNumero = new RegExp(/[-]{0,1}[\d]*[\.|,]{0,1}[\d]+/g);

                if (result != null) {
                    result = result[0].match(pesoSoloNumero);
                }
                return result;
            };



            scope.buscarTalla = function (texto) {
                var talla = new RegExp(/[-]{0,1}[\d]*[\.|,]{0,1}[\d]+ (cm|CM|Cm)+/g);
                var tallaSoloNumero = new RegExp(/[-]{0,1}[\d]*[\.|,]{0,1}[\d]+/g);
                var result = texto.match(talla);


                if (result != null) {
                    result = result[0].match(tallaSoloNumero);
                    if (result < 2) {
                        result = result * 100;
                    }
                }
                return result;

            };


            scope.buscarSistolica = function (texto) {
                var valor = new RegExp(/(Sistólica :|Sistolica :|sistolica :|sistólica :) +[-]{0,1}[\d]*[\.|,]{0,1}[\d]+/g);
                var result = texto.match(valor);
                var pesoSoloNumero = new RegExp(/[-]{0,1}[\d]*[\.|,]{0,1}[\d]+/g);

                if (result != null) {
                    result = result[0].match(pesoSoloNumero);
                }
                return result;
            };



            scope.buscarDiastolica = function (texto) {
                var valor = new RegExp(/(Diastólica :|Diastolica :|diastolica :|diastólica :) +[-]{0,1}[\d]*[\.|,]{0,1}[\d]+/g);
                var result = texto.match(valor);
                var pesoSoloNumero = new RegExp(/[-]{0,1}[\d]*[\.|,]{0,1}[\d]+/g);

                if (result != null) {
                    result = result[0].match(pesoSoloNumero);
                }
                return result;
            };


            scope.buscarPulso = function (texto) {
                var valor = new RegExp(/(Pulso :|pulso :) +[-]{0,1}[\d]*[\.|,]{0,1}[\d]+/g);
                var result = texto.match(valor);
                var pesoSoloNumero = new RegExp(/[-]{0,1}[\d]*[\.|,]{0,1}[\d]+/g);

                if (result != null) {
                    result = result[0].match(pesoSoloNumero);
                }
                return result;
            };

            scope.buscarFR = function (texto) {
                var valor = new RegExp(/(Fr :|FR :) +[-]{0,1}[\d]*[\.|,]{0,1}[\d]+/g);
                var result = texto.match(valor);
                var pesoSoloNumero = new RegExp(/[-]{0,1}[\d]*[\.|,]{0,1}[\d]+/g);

                if (result != null) {
                    result = result[0].match(pesoSoloNumero);
                }
                return result;
            };



            scope.buscarSMC = function (texto) {
                var valor = new RegExp(/(SMC :|FR :) +[-]{0,1}[\d]*[\.|,]{0,1}[\d]+/g);
                var result = texto.match(valor);
                var pesoSoloNumero = new RegExp(/[-]{0,1}[\d]*[\.|,]{0,1}[\d]+/g);

                if (result != null) {
                    result = result[0].match(pesoSoloNumero);
                }
                return result;
            };

            scope.buscarTemp = function (texto) {
                var valor = new RegExp(/(Temp :) +[-]{0,1}[\d]*[\.|,]{0,1}[\d]+/g);
                var result = texto.match(valor);
                var pesoSoloNumero = new RegExp(/[-]{0,1}[\d]*[\.|,]{0,1}[\d]+/g);

                if (result != null) {
                    result = result[0].match(pesoSoloNumero);
                }
                return result;
            };
            scope.buscarAbdominal = function (texto) {
                var valor = new RegExp(/(Abdominal:|ABDOMINAL:|abdominal:|Abdominal :|ABDOMINAL : |abdominal :|Abdominal: |ABDOMINAL: |abdominal: ) +[-]{0,1}[\d]*[\.|,]{0,1}[\d]+/g);
                var result = texto.match(valor);
                var pesoSoloNumero = new RegExp(/[-]{0,1}[\d]*[\.|,]{0,1}[\d]+/g);

                if (result != null) {
                    result = result[0].match(pesoSoloNumero);
                }
                return result;
            };  
            element.on('$destroy', function () {
                element.off();
            });

        }
    };
});