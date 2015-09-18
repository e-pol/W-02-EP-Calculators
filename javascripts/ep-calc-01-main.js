var epCalc01main = function () {
        "use strict";

        var q_Normal = 2.0,         // input values
            q_Rated = 2.2,
            l_Length = 4000/10,
            b_Width = 50/10,
            h_Height = 200/10,
            beamMaterial = "pine",
            R_bend = 130,           // depend on beamMaterial value
            E_ = 100000,            // depend on beamMaterial value
            M_max = q_Rated * Math.pow(l_Length, 2) / 8,
            W_required = M_max / R_bend,
            W_parameters = b_Width * Math.pow(h_Height, 2) / 6,
            J_Beam = b_Width * Math.pow(h_Height, 3)/ 12,
            f_To_l = 5 * q_Normal * Math.pow(l_Length, 3) / (384 * E_ * J_Beam);

        console.group("Расчет балки");
          console.log("M_max = " + M_max.toLocaleString());
          console.log("W_required = " + W_required.toLocaleString());
          console.log("W_parameters = " + W_parameters.toLocaleString());
          console.log("f/l = " + f_To_l.toLocaleString());
        console.groupEnd();
    };

$(document).ready(epCalc01main);