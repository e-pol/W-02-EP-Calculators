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
     * An object literal with geometric parameters for the rectangular shape beam
     *
     * @namespace epCalcBeams
     * @class beam_rectangular
     */
    var beamRectangular = {
        b_Width: 50,
        h_Height: 200,

       /**
        * Calculates W for rectangular shape
        *
        * @method getW
        * @return {Number} For set b_Width and h_Height
        */
        getW: function () {
            return (this.b_Width / 10) * Math.pow(this.h_Height / 10, 2) / 6;
        },

       /**
        * Calculates J for rectangular shape
        *
        * @method getJ
        * @return {Number} For set b_Width and h_Height
        */
        getJ: function () {
            return (this.b_Width / 10) * Math.pow(this.h_Height / 10, 3) / 12;
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

            $content.bind("change", function(event) {
                beamRectangular.b_Width = $("#" + id + " input:eq(0)").val();
                beamRectangular.h_Height = $("#" + id + " input:eq(1)").val();

                // This changes values of W and J to current, depending on set measures
                $("input[id*='W_beam']").val(beamRectangular.getW());
                $("input[id*='J_beam']").val(beamRectangular.getJ());
            });

            $content.append($("<legend>Прямоугольное сечение</legend>"));

    		/** 
    		 * Do not change the order of inputs
    		 * If changed rewrite code for handlers binding above
             */
            $content.append($("<span> Толщина, мм </span>"));
            $content.append($("<input>",
                              {
                              	type: "number",
                              	value: this.b_Width,
                              	min: 0
                              }));
            $content.append($("<span> Высота, мм </span>"));
            $content.append($("<input>",
                              {
                              	type: "number",
                              	value: this.h_Height,
                              	min: 0
                              }));

            $content.append($("<span> W </span>"));
            $content.append($("<input>",
    		                  {
    		                  	id: id + "-W_beam",
    		                  	type: "number",
    		                  	value: beamRectangular.getW(),
    		                  	disabled: true
    		                  }));
    		$content.append($("<span> J </span>"));
    		$content.append($("<input>",
    		                  {
    		                  	id: id + "-J_beam",
    		                  	type: "number",
    		                  	value: beamRectangular.getJ(),
    		                  	disabled: true
    		                  }));

    		$content.appendTo(container);	
    	}
    };

    /**
     * An object literal with parameters of different materials
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

    		$content.bind("change", function (event) {
    			var el = event.target,
    			    i = 0;

    			    console.dir(el);
    			// set current material
    			while (el.value !== beamMaterial.materials[i].id) {
    				i++;
    			}

    			beamMaterial.current = i;

    			// This changes values of R and E to current, depending on chosen material
    			$("input[id*='R_bend']").val(beamMaterial.materials[i]["R_bend"]);
    			$("input[id*='E_module']").val(beamMaterial.materials[i]["E_module"]);

    		});

    		$content.append($("<legend>Материал</legend>"));
    		$content.append($("<span> Наименование </span>"));
    		$content.append($("<select>"));

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

    		$content.append($("<span> R<sub>и</sub></span>"));
    		$content.append($("<input>",
    		                  {
    		                  	id: id + "-R_bend",
    		                  	type: "number",
    		                  	value: beamMaterial.materials[beamMaterial.current]["R_bend"],
    		                  	disabled: true
    		                  }));
    		$content.append($("<span> E </span>"));
    		$content.append($("<input>",
    		                  {
    		                  	id: id + "-E_module",
    		                  	type: "number",
    		                  	value: beamMaterial.materials[beamMaterial.current]["E_module"],
    		                  	disabled: true
    		                  }));

    		$content.appendTo(container);
    	}
    };

    /**
     * An object literal for calculating single span beam 
     * @namespace epCalcBeams
     * @class schema_single_span_beam
     */
    var beamSchemaSingleSpan = {
        q_Normal: 2.0,
        q_Rated: 2.2,
        l_Length: 4000,

        /**
    	* Calculates M_max for single span beam
    	*
    	* @method getM_max
    	* @return {Number} For set q_Rated and l_Length
    	*/
    	getM_max: function () {
    		return this.q_Rated * Math.pow(this.l_Length / 10, 2) / 8;
    	},

    	/**
    	* Calculates W required basing on M_max and material bend Resistance
    	*
    	* @method getW
    	* @return {Number} For set b_Width and h_Height
    	*/
    	W_req: function (R_bend) {
    		return this.M_max() / R_bend;
    	},
    	f_To_l: function (E_module, J_beam) {
    		return 5 * this.q_Normal * Math.pow(this.l_Length / 10, 3) / (384 * E_module * J_beam);
    	}
    };

    // init
    var init = function (container) {
    	var $container = container;
        $container.append($("<h2>Расчет балок</h2>"));
        beamRectangular.init($container);
        beamMaterial.init($container);	
    };

    init($("#epCalcBeams"));
};

$(document).ready(epCalcBeams);