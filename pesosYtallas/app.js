var app = angular.module('phonecatApp', ['ui.grid']);


app.controller('MainCtrl', MainCtrl);



function MainCtrl() {
    this.data = [];








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
            data: '@'
        },
        link: function (scope, element, attrs) {
            var onChangeHandler = scope.$eval(attrs.customOnChange);
            scope.informeFinal = [];
            element.on('change', function (event) {
                var files = event.target.files;
                scope.parseExcel(files[0]);
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
                                talla: String(scope.buscarEnCadena(element[column], 'talla'))
                            });

                        });


                        // jQuery( '#xlx_json' ).val( JSON.stringify(InformeFinal) );

                        console.log(scope.informeFinal);
                        scope.data = scope.informeFinal;

                        alasql.promise('SELECT * INTO XLSX("restest280b.xlsx",{headers:true}) FROM ?', [scope.informeFinal])
                            .then(function (data) {
                                console.log('Data saved');
                            }).catch(function (err) {
                                console.log('Error:', err);
                            });
                    });
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

                //var talla = new RegExp(/(peso: |talla: |altura: )+[-]{0,1}[\d]*[\.]{0,1}[\d]+ (cm|kg)+/g);
                if (texto != undefined) {
                    if (tipo == 'peso') {
                        var peso = new RegExp(/[-]{0,1}[\d]*[\.|,]{0,1}[\d]+ (kg|Kg|KG)+/g);
                        var result = texto.match(peso);
                        var pesoSoloNumero = new RegExp(/[-]{0,1}[\d]*[\.|,]{0,1}[\d]+/g);

                        if (result != null) {
                            result = result[0].match(pesoSoloNumero);
                        }
                    } else {
                        var talla = new RegExp(/[-]{0,1}[\d]*[\.|,]{0,1}[\d]+ (cm|CM|Cm)+/g);
                        var tallaSoloNumero = new RegExp(/[-]{0,1}[\d]*[\.|,]{0,1}[\d]+/g);
                        var result = texto.match(talla);


                        if (result != null) {
                            result = result[0].match(tallaSoloNumero);
                            if(result < 2)
                            {
                                result = result * 100;
                            }
                        }
                    }

                } else {
                    result = []
                }


                return result;
            };



            element.on('$destroy', function () {
                element.off();
            });

        }
    };
});