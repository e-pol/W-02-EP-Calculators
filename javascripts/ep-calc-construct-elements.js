;

/**
 * JavaScript module for design of beams, rafters and columns
 *
 * @module epCalcConstructElements
 */
var epCalcConstructElements = function () {
    "use strict";

    var moduleId = "epCalcConstructElements";

    /**
     * Root object for construction elements calculator
     *
     * @namespace epCalcConstructElements
     * @class construction_elements_calculator
     */
    var elements = {

      /**
        * Print result
        *
        * @method print
        * @return {Void}
        */
        print: function () {
            // Prints result
        },

      /**
        * Email result
        *
        * @method email
        * @return {Void}
        */
        email: function () {
            // Emails result
        },

      /**
        * Show general calculator help
        *
        * @method help
        * @return {Void}
        */
        help: function () {
            // Show general help
        },

      /**
        * Check for errors
        *
        * @method check
        * @return {String} message OK or Error message
        */
        check: function () {
            // Checks for errors
        },

      /**
        * Applies changes and calls dependencies
        *
        * @method applyChanges
        * @return {String} message OK or Error message
        */
        applyChanges: function () {
            // Calls this.check
            // Calls dependencies
        },

      /**
        * Initializes root object of the module:
        * - creates and adds to DOM new nodes;
        * - applies event handlers;
        * - defines dependencies;
        *
        * @method init
        * @param {Object} container Parent DOM object to append new objects to
        * @return {Void}
        */
        init: function (container) {

        }
    };

    // init
    var containerEl = $("#epCalcConstructElements");

    elements.init(containerEl);
};

$(document).ready(epCalcConstructElements);