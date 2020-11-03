import { defineRule } from 'vee-validate'
import * as rules from '@vee-validate/rules'

// Globally define all the available rules
Object.keys(rules).forEach(rule => {
  defineRule(rule, rules[rule]);
});
