// CureCraft Mathematical Formula Audit Suite
// Verifies all charcuterie, curing salt, and food safety calculations against USDA FSIS standards.

const CureMath = require('../assets/js/calculators.js');

console.log('=== RUNNING CURECRAFT FORMULA AUDIT SUITE ===\n');

let passCount = 0;
let failCount = 0;

function assertClose(testName, actual, expected, tolerance = 0.05) {
  const diff = Math.abs(actual - expected);
  if (diff <= tolerance) {
    console.log(`✓ PASS: [${testName}] -> Got ${actual}, Expected ~${expected}`);
    passCount++;
  } else {
    console.error(`✗ FAIL: [${testName}] -> Got ${actual}, Expected ${expected} (diff: ${diff})`);
    failCount++;
  }
}

function assertTrue(testName, condition) {
  if (condition) {
    console.log(`✓ PASS: [${testName}]`);
    passCount++;
  } else {
    console.error(`✗ FAIL: [${testName}]`);
    failCount++;
  }
}

// TEST 1: Standard Equilibrium Dry Cure with Prague Powder #1 (Bacon)
// 1000g pork belly, 2.5% target salt, 0.25% Cure #1 (6.25% NaNO2), 1.5% brown sugar
const test1 = CureMath.calculateEquilibriumDryCure({
  meatWeightG: 1000,
  targetSaltPct: 2.5,
  cureType: 'cure1',
  customCurePct: 0.25,
  targetSugarPct: 1.5
});
assertClose('Test 1: Cure #1 Weight', test1.cureWeightG, 2.5);
assertClose('Test 1: Nitrite PPM', test1.nitritePpm, 156.25, 0.5);
assertClose('Test 1: Salt from Cure #1 (93.75%)', test1.saltFromCureG, 2.34);
assertClose('Test 1: Pure Salt to Add (25 - 2.34)', test1.pureSaltG, 22.66);
assertClose('Test 1: Total Effective Salt', test1.totalEffectiveSaltG, 25.0);
assertTrue('Test 1: Safety Status Optimal', test1.safetyStatus === 'optimal');

// TEST 2: Charcuterie Dry Cure with Prague Powder #2 (Bresaola / Salami)
// 1200g eye of round, 2.75% target salt, 0.25% Cure #2 (6.25% NaNO2, 4.0% NaNO3), 0.5% dextrose
const test2 = CureMath.calculateEquilibriumDryCure({
  meatWeightG: 1200,
  targetSaltPct: 2.75,
  cureType: 'cure2',
  customCurePct: 0.25,
  targetSugarPct: 0.5
});
assertClose('Test 2: Cure #2 Weight (0.25% of 1200g)', test2.cureWeightG, 3.0);
assertClose('Test 2: Nitrite PPM', test2.nitritePpm, 156.25, 0.5);
assertClose('Test 2: Nitrate PPM (4% NaNO3)', test2.nitratePpm, 100.0, 0.5);
assertClose('Test 2: Salt from Cure #2 (89.75%)', test2.saltFromCureG, 2.69);
assertClose('Test 2: Pure Salt to Add (33.0 - 2.69)', test2.pureSaltG, 30.31);
assertClose('Test 2: Total Effective Salt', test2.totalEffectiveSaltG, 33.0);

// TEST 3: European Peklosol (0.6% NaNO2) Safety Conversion
// 1000g meat, target 156 ppm using Peklosol
const test3 = CureMath.calculateEquilibriumDryCure({
  meatWeightG: 1000,
  targetSaltPct: 2.6,
  cureType: 'peklosol',
  targetSugarPct: 1.0
});
assertClose('Test 3: Peklosol Weight (26g / 2.6%)', test3.cureWeightG, 26.0, 0.1);
assertClose('Test 3: Nitrite PPM delivered', test3.nitritePpm, 156.0, 0.5);
assertClose('Test 3: Salt delivered by Peklosol (99.4%)', test3.saltFromCureG, 25.84, 0.1);
assertClose('Test 3: Additional Pure Salt to Add', test3.pureSaltG, 0.16, 0.2);

// TEST 4: Equilibrium Wet Brining (Corned Beef / Pastrami)
// 1500g brisket + 1500g water = 3000g total system. 2.5% target salt, 0.25% Cure #1
const test4 = CureMath.calculateEquilibriumWetBrine({
  meatWeightG: 1500,
  waterWeightG: 1500,
  targetSaltPct: 2.5,
  targetSugarPct: 1.5,
  customCurePct: 0.25
});
assertClose('Test 4: Total System Weight', test4.totalSystemWeightG, 3000.0);
assertClose('Test 4: Cure #1 Weight (0.25% of 3000g)', test4.cureWeightG, 7.5);
assertClose('Test 4: Nitrite PPM in system', test4.nitritePpm, 156.25, 0.5);
assertClose('Test 4: Pure Salt to Add (75g - 7.03g)', test4.pureSaltG, 67.97, 0.1);
assertClose('Test 4: Sugar to Add (1.5% of 3000g)', test4.sugarG, 45.0);

// TEST 5: Charcuterie Target Weight Loss & Water Activity
// 1450g green weight, 38% target loss, current weight 1050g
const test5 = CureMath.calculateCharcuterieDrying({
  greenWeightG: 1450,
  targetLossPct: 38.0,
  currentWeightG: 1050
});
assertClose('Test 5: Target Finished Weight (1450 * 0.62)', test5.targetFinishedWeightG, 899.0);
assertClose('Test 5: Weight Lost (1450 - 1050)', test5.weightLostG, 400.0);
assertClose('Test 5: Current Loss Pct (400 / 1450)', test5.currentLossPct, 27.59, 0.05);
assertClose('Test 5: Remaining to Lose (1050 - 899)', test5.remainingToLoseG, 151.0);
assertTrue('Test 5: Not Safe Yet (27.59% < 35%)', test5.isSafeToEat === false);

// Test 5b: Reach 38% loss
const test5b = CureMath.calculateCharcuterieDrying({
  greenWeightG: 1450,
  targetLossPct: 38.0,
  currentWeightG: 899
});
assertTrue('Test 5b: Safe to Eat (reached 38% loss)', test5b.isSafeToEat === true);
assertTrue('Test 5b: Estimated aw <= 0.88', test5b.estimatedAw <= 0.88);

// TEST 6: Fick's Law Cure Penetration & Thickness Time
// 2 inch (50.8mm) pork belly slab
const test6 = CureMath.calculateCuringTime({
  thicknessMm: 50.8,
  geometry: 'slab',
  isBoneIn: false
});
assertClose('Test 6: Thickness Inches', test6.thicknessInches, 2.0);
assertTrue('Test 6: Min Safe Days (4 base + 2 buffer = 6)', test6.minSafeDays === 6);
assertTrue('Test 6: Recommended Days (6 + 3 = 9)', test6.recommendedDays === 9);

// TEST 7: South African Biltong Ratio
// 2000g beef silverside, 2.2% salt, 1.8% coriander, 0.6% pepper, 0.8% sugar, 52% loss
const test7 = CureMath.calculateBiltong({
  rawMeatG: 2000,
  saltPct: 2.2,
  corianderPct: 1.8,
  pepperPct: 0.6,
  sugarPct: 0.8,
  expectedLossPct: 52.0
});
assertClose('Test 7: Salt (2.2% of 2000g)', test7.saltG, 44.0);
assertClose('Test 7: Coriander (1.8% of 2000g)', test7.corianderG, 36.0);
assertClose('Test 7: Pepper (0.6% of 2000g)', test7.pepperG, 12.0);
assertClose('Test 7: Vinegar (40ml/kg * 2kg)', test7.vinegarMl, 80.0);
assertClose('Test 7: Dried Yield (2000 * 0.48)', test7.estimatedYieldG, 960.0);

// TEST 8: International Curing Salt Converter
// 1000g meat, target 156.25 ppm using Aussie Cure (5% NaNO2)
const test8 = CureMath.convertCuringSalt({
  meatWeightG: 1000,
  sourceSaltType: 'aussie',
  targetPpm: 156.25
});
assertClose('Test 8: Aussie Cure Required Weight', test8.requiredWeightG, 3.125, 0.05);
assertClose('Test 8: Aussie Cure Percentage of Meat', test8.percentageOfMeat, 0.31, 0.05);

console.log('\n=====================================================');
if (failCount === 0) {
  console.log(`ALL ${passCount} FORMULA AUDIT TESTS PASSED SUCCESSFULLY! 100%`);
  console.log('=====================================================\n');
  process.exit(0);
} else {
  console.error(`FAILED: ${failCount} tests failed out of ${passCount + failCount}`);
  console.log('=====================================================\n');
  process.exit(1);
}
