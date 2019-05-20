import { FormElementStatus} from 'rules-config/rules';
import lib from '../lib';

class RuleHelper {
    
    static _calculateBMI = (weight, height) => {
        return Math.ceil((weight / Math.pow(height, 2)) * 10000, 1);
    };

    static createBMIFormElementStatus(height, weight, formElement) {
        let value;
        height = height && height.getValue();
        weight = weight && weight.getValue();
        if (Number.isFinite(weight) && Number.isFinite(height)) {
            value = lib.C.calculateBMI(weight, height);
        }
        return new FormElementStatus(formElement.uuid, true, value);
    }
 
}

module.exports = RuleHelper;