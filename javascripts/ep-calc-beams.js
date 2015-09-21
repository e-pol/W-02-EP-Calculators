;

/**
 * JavaScript module that does some maths about beams
 *
 * @module epCalcBeams
 */

var epCalcBeams = function () {
    "use strict";

    var moduleId = "epCalcBeams";

    /**
     * An object literal containing and computing 
     * geometric parameters for the rectangular shape beam
     *
     * @namespace epCalcBeams
     * @class beam_rectangular
     */
    var beamRectangular = {
        b_Width: 50,
        h_Height: 200,

       /**
        * Calculates resistance moment (W) for rectangular shape
        *
        * @method getW
        * @return {Number} For set b_Width and h_Height
        */
        getW: function () {
            return (beamRectangular.b_Width / 10) * Math.pow(beamRectangular.h_Height / 10, 2) / 6;
        },

       /**
        * Calculates J for rectangular shape
        *
        * @method getJ
        * @return {Number} For set b_Width and h_Height
        */
        getJ: function () {
            return (beamRectangular.b_Width / 10) * Math.pow(beamRectangular.h_Height / 10, 3) / 12;
        },

       /**
        * Adds "input" tags to Parent object and sets event handlers
        *
        * @method init
        * @param {Object} container Parent object to append "input" tags to
        */
        init: function (container) {
            var $content,
                id = moduleId + "-beamRectangular";

            $content = $("<fieldset>", {id: id});

    	    // This changes values of b and h of object to current
            $content
                .bind("change", function(event) {
                    beamRectangular.b_Width = $("#" + id + " input:eq(0)").val();
                    beamRectangular.h_Height = $("#" + id + " input:eq(1)").val();

                    // This changes values of W and J to current, depending on set measures
                    $("input[id*='W_beam']").val(beamRectangular.getW());
                    $("input[id*='J_beam']").val(beamRectangular.getJ());

                    // Dependencies
    	            $("input[id*='f_to_l']").val(beamSchemaSingleSpan.get_f_To_l());
                })
                .append($("<legend>Прямоугольное сечение</legend>"))

                /** 
                 * Do not change the order of inputs
                 * If changed rewrite code for handlers binding above
                 */
                .append($("<span>Толщина, мм</span>"))
                .append($("<input>",
                          {
                            type: "number",
                            value: beamRectangular.b_Width,
                            min: 0
                          }))
                .append($("<span>Высота, мм</span>"))
                .append($("<input>",
                          {
                            type: "number",
                            value: beamRectangular.h_Height,
                            min: 0
                          }))
                .append($("<span>Момент сопротивления W, см<sup>3</sup></span>"))
                .append($("<input>",
                          {
                            id: id + "-W_beam",
                            type: "number",
                            value: beamRectangular.getW(),
                            disabled: true
                          }))
                .append($("<span>Осевой момент инерции J, см<sup>4</sup></span>"))
                .append($("<input>",
                          {
                            id: id + "-J_beam",
                            type: "number",
                            value: beamRectangular.getJ(),
                            disabled: true
                          }))
                
                .appendTo(container);
        }
    };

    /**
     * An object literal containing mechanical and physical parameters of different materials
     * @namespace epCalcBeams
     * @class beam_material
     */
    var beamMaterial = {
        current: 0,
        materials: [
            {
                id: "pine",
                name: "сосна",
                R_bend: 130,
                E_module: 100000
            },
            {
                id: "ultralam_r",
                name: "LVL Ultralam тип R",
                R_bend: 260,
                E_module: 140000
            }
        ],

    	/**
    	* Adds "select" and "option" tags to Parent object and sets event handlers
    	*
    	* @method init
    	* @param {Object} container Parent object to append "select" tag to
    	*/
    	init: function (container) {
    		var $content,
    		    id = moduleId + "-beamMaterial";

    		$content = $("<fieldset>", {id: id});
    		    
    		$content
    		    .bind("change", function (event) {
    			    var el = event.target,
    			        i = 0;

    			// set current material
    			while (el.value !== beamMaterial.materials[i].id) {
    				i++;
    			}

    			beamMaterial.current = i;

    			// This changes values of R and E to current, depending on chosen material
    			$("input[id*='R_bend']").val(beamMaterial.materials[i]["R_bend"]);
    			$("input[id*='E_module']").val(beamMaterial.materials[i]["E_module"]);

    			// Dependencies
    			$("input[id*='W_req']").val(beamSchemaSingleSpan.getW_req());

    		})
    		    .append($("<legend>Материал</legend>"))
    		    .append($("<span>Наименование</span>"))
    		    .append($("<select>"));

    		// Creating set of "option" nodes from array with materials` properties
    		beamMaterial.materials.forEach(function (material) {
    			var $option = $("<option>",
    				            {
    			                    value: material.id,
    			                }),
    			    textNode = document.createTextNode(material.name);

    			$($option).append(textNode);
    			$("select", $content).append($option);
    		});

    		$content
    		    .append($("<span>R<sub>и</sub></span>"))
    		    .append($("<input>",
    		              {
    		                id: id + "-R_bend",
    		                type: "number",
    		                value: beamMaterial.materials[beamMaterial.current]["R_bend"],
    		                disabled: true
    		              }))
    		    .append($("<span>E</span>"))
    		    .append($("<input>",
    		              {
    		                id: id + "-E_module",
    		                type: "number",
    		                value: beamMaterial.materials[beamMaterial.current]["E_module"],
    		                disabled: true
    		              }))

    		    .appendTo(container);
    	}
    };

    /**
     * An object literal for making calculations regarding single span beam 
     * @namespace epCalcBeams
     * @class schema_single_span_beam
     */
    var beamSchemaSingleSpan = {
        q_Normal: 1.69,
        q_Rated: 2.2,
        l_Length: 4000,

        /**
    	* Calculates maximum bending moment (Mmax) for single span beam
    	*
    	* @method getM_max
    	* @return {Number} Returns maximum bending moment (Mmax)
    	*/
    	getM_max: function () {
    		return beamSchemaSingleSpan.q_Rated * Math.pow(beamSchemaSingleSpan.l_Length / 10, 2) / 8;
    	},

    	/**
    	* Calculates required resistance moment (W) for defined bending resistance (R)
    	*
    	* @method getW_req
    	* @param {Number} R_bend Bending resistance (R)
    	* @return {Number} Returns required resistance moment (W)
    	*/
    	getW_req: function () {
    		return beamSchemaSingleSpan.getM_max() / beamMaterial.materials[beamMaterial.current]["R_bend"];
    	},

    	get_f_To_l: function () {
    		return 5 * beamSchemaSingleSpan.q_Normal * Math.pow(beamSchemaSingleSpan.l_Length / 10, 3) / (384 * beamMaterial.materials[beamMaterial.current]["E_module"] * beamRectangular.getJ());
    	},

    	/**
    	* Adds "select" and "option" tags to Parent object and sets event handlers
    	*
    	* @method init
    	* @param {Object} container Parent object to append "select" tag to
    	*/
    	init: function (container) {
            var $content,
                id = moduleId + "-beamSchemaSingleSpan";

            $content = $("<fieldset>", {id: id});
    		
           /** Event handlers listening other objects (this depends on)
            *
            * !!! REWRITE DEPENDENCIES !!!
            * object: beamMaterial
            * param: R_bend
            * dependant: this.getW_req
            */

    		// Event handlers listening this object

            $content
                .bind("change", function(event) {
                    beamSchemaSingleSpan.q_Normal = $("#" + id + " input:eq(0)").val();
                    beamSchemaSingleSpan.q_Rated = $("#" + id + " input:eq(1)").val();
                    beamSchemaSingleSpan.l_Length = $("#" + id + " input:eq(2)").val();

                    // This changes values of Mmax, Wreq and f/l depending on set parameters
                    $("input[id*='M_max']").val(beamSchemaSingleSpan.getM_max());
                    $("input[id*='W_req']").val(beamSchemaSingleSpan.getW_req());
                    $("input[id*='f_to_l']").val(beamSchemaSingleSpan.get_f_To_l());
                })
                .append($("<legend>Однопролетная балка</legend>"))

                /** 
                 * Do not change the order of inputs
                 * If changed rewrite code for handlers binding above
                 */
                .append($("<span>Распределенная нагрузка нормативная q<sub>н</sub></span>"))
                .append($("<input>",
                          {
                            type: "number",
                            value: beamSchemaSingleSpan.q_Normal,
                            min: 0,
                            step: 0.01
                          }))
                .append($("<span>Распределенная нагрузка расчетная q<sub>р</sub></span>"))
                .append($("<input>",
                          {
                            type: "number",
                            value: beamSchemaSingleSpan.q_Rated,
                            min: 0,
                            step: 0.01
                          }))
                .append($("<span>Пролет l, мм</span>"))
                .append($("<input>",
                          {
                            type: "number",
                            value: beamSchemaSingleSpan.l_Length,
                            min: 0
                          }))
                .append($("<span>Максимальный изгибающий момент М<sub>max</sub>, кгс х см<sup>2</sup></span>"))
                .append($("<input>",
                          {
                            id: id + "-M_max",
                            type: "number",
                            value: beamSchemaSingleSpan.getM_max(),
                            disabled: true
                          }))
                .append($("<span>Требуемый момент сопротивления W<sub>тр</sub>, см<sup>3</sup></span>"))
                .append($("<input>",
                          {
                            id: id + "-W_req",
                            type: "number",
                            value: beamSchemaSingleSpan.getW_req(),
                            disabled: true
                          }))
                .append($("<span>Максимальный прогиб f/l</span>"))
                .append($("<input>",
                          {
                            id: id + "-f_to_l",
                            type: "number",
                            value: beamSchemaSingleSpan.get_f_To_l(),
                            disabled: true
                          }))
                
                .appendTo(container);
    	}
    };

    // init
    var init = function (container) {
    	var $container = container;
        $container.append($("<h2>Расчет деревянных балок</h2>"));
        beamRectangular.init($container);
        beamMaterial.init($container);
        beamSchemaSingleSpan.init($container);
    };

    init($("#epCalcBeams"));
};

$(document).ready(epCalcBeams);