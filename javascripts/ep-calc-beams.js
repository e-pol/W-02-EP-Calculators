; 

/**
 * JavaScript module that does some maths about beams
 *
 * @module epCalcBeams
 */

var epCalcBeams = function () {
    "use strict";

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
    		    id = "epCalcBeams-beamRectangular";
    		$content = $("<fieldset>", {id: id})
    		$content.bind("change", function(event) {
    			this.b_Width = $("#epCalcBeams-beamRectangular input:eq(0)").val();
    			this.h_Height = $("#epCalcBeams-beamRectangular input:eq(1)").val();
    			console.log(this.b_Width + " " + this.h_Height);
    		});
    		$content.append($("<legend>Прямоугольное сечение</legend>"));

    		/** 
    		 * Do not change the order of inputs
    		 * If changed refactor handlers binding above
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
    		$content.append($("<span> Материал </span>"));
    		$content.append($("<select>")
    			            .append($("<option>Сосна</option>",
    			                      {
    			                      	value: "pine",
    			                      	selected: "selected"
    			                      }))
    			            .append($("<option>LVL Ultralam тип R</option>",
    			            	      {
    			            	      	value: "ultralam_r"
    			            	      })));
    		$content.appendTo(container);
    	}
    };

    /**
     * An object literal with parameters of different materials
     * @namespace epCalcBeams
     * @class beam_material
     */
    var beamMaterial = {
    	material: {
    		"pine": {
    			"name": "сосна",
    			R_bend: 130,
    			E_module: 100000
    		}
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
    	M_max: function () {
    		return this.q_Rated * Math.pow(this.l_Length / 10, 2) / 8;
    	},
    	W_required: function (R_bend) {
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
    };

    init($("#epCalcBeams"));
    

    console.group("Расчет однопролетной балки");
        console.log("beamRectangular.b_Width: " + beamRectangular.b_Width.toLocaleString());
        console.log("beamSchemaSingleSpan.W_required(130): " + beamSchemaSingleSpan.W_required(130).toLocaleString());
        /*console.log("W_parameters = " + W_parameters.toLocaleString());
        console.log("f/l = " + f_To_l.toLocaleString());*/
    console.groupEnd();
};

$(document).ready(epCalcBeams);