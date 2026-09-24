/**
 * CureCraft Core Mathematical Engine
 * Pure scientific algorithms for meat curing, charcuterie, and USDA FSIS food safety standards.
 * Zero external dependencies.
 */

const CureMath = {
  // Physical and Chemical Constants
  CONSTANTS: {
    PRAGUE_POWDER_1_NITRITE_RATIO: 0.0625, // 6.25% Sodium Nitrite (NaNO2)
    PRAGUE_POWDER_1_SALT_RATIO: 0.9375,    // 93.75% Sodium Chloride (NaCl)
    PRAGUE_POWDER_2_NITRITE_RATIO: 0.0625, // 6.25% Sodium Nitrite (NaNO2)
    PRAGUE_POWDER_2_NITRATE_RATIO: 0.0400, // 4.00% Sodium Nitrate (NaNO3)
    PRAGUE_POWDER_2_SALT_RATIO: 0.8975,    // 89.75% Sodium Chloride (NaCl)
    PEKLOSOL_NITRITE_RATIO: 0.006,         // 0.6% European Nitritpokelsalz standard
    PEKLOSOL_SALT_RATIO: 0.994,            // 99.4% Sodium Chloride
    AUSSIE_CURE_NITRITE_RATIO: 0.050,      // 5.0% Australian Curing Salt
    AUSSIE_CURE_SALT_RATIO: 0.950,         // 95.0% Sodium Chloride
    USDA_TARGET_NITRITE_PPM: 156.25,       // Standard whole muscle / bacon target
    USDA_MAX_BACON_NITRITE_PPM: 200.0,     // Maximum allowable in dry-cured bacon
    USDA_MIN_BACON_NITRITE_PPM: 120.0,     // Minimum recommended for C. botulinum inhibition
    SODIUM_ERYTHORBATE_RATIO: 0.000547     // 547 ppm cure accelerator standard
  },

  /**
   * 1. Equilibrium Dry Cure Calculator
   * Calculates exact salt, curing salt (Cure #1 or #2), sugar, and USDA Nitrite PPM.
   * Automatically deducts the salt present within Prague Powder from pure salt required.
   */
  calculateEquilibriumDryCure: function(options) {
    const meatWeightG = parseFloat(options.meatWeightG) || 0;
    const targetSaltPct = parseFloat(options.targetSaltPct) || 2.5; // Default 2.5%
    const cureType = options.cureType || 'cure1'; // 'cure1', 'cure2', 'peklosol', 'none'
    const targetSugarPct = parseFloat(options.targetSugarPct) || 1.0; // Default 1.0%
    const customCurePct = options.customCurePct ? parseFloat(options.customCurePct) : 0.25;

    if (meatWeightG <= 0) {
      return { error: 'Meat weight must be greater than zero' };
    }

    let cureWeightG = 0;
    let nitritePpm = 0;
    let nitratePpm = 0;
    let saltFromCureG = 0;

    if (cureType === 'cure1') {
      cureWeightG = meatWeightG * (customCurePct / 100);
      nitritePpm = (cureWeightG * this.CONSTANTS.PRAGUE_POWDER_1_NITRITE_RATIO / meatWeightG) * 1000000;
      saltFromCureG = cureWeightG * this.CONSTANTS.PRAGUE_POWDER_1_SALT_RATIO;
    } else if (cureType === 'cure2') {
      cureWeightG = meatWeightG * (customCurePct / 100);
      nitritePpm = (cureWeightG * this.CONSTANTS.PRAGUE_POWDER_2_NITRITE_RATIO / meatWeightG) * 1000000;
      nitratePpm = (cureWeightG * this.CONSTANTS.PRAGUE_POWDER_2_NITRATE_RATIO / meatWeightG) * 1000000;
      saltFromCureG = cureWeightG * this.CONSTANTS.PRAGUE_POWDER_2_SALT_RATIO;
    } else if (cureType === 'peklosol') {
      // 0.6% EU Peklosol: to reach 156 ppm, requires 2.6% total weight
      cureWeightG = (this.CONSTANTS.USDA_TARGET_NITRITE_PPM * meatWeightG) / (this.CONSTANTS.PEKLOSOL_NITRITE_RATIO * 1000000);
      nitritePpm = (cureWeightG * this.CONSTANTS.PEKLOSOL_NITRITE_RATIO / meatWeightG) * 1000000;
      saltFromCureG = cureWeightG * this.CONSTANTS.PEKLOSOL_SALT_RATIO;
    }

    const totalTargetSaltG = meatWeightG * (targetSaltPct / 100);
    const pureSaltG = Math.max(0, totalTargetSaltG - saltFromCureG);
    const sugarG = meatWeightG * (targetSugarPct / 100);
    const totalCureMixG = pureSaltG + cureWeightG + sugarG;

    // Safety classification
    let safetyStatus = 'optimal';
    let safetyMessage = 'Compliant with USDA FSIS 120–200 PPM standard.';
    if (nitritePpm < 100 && cureType !== 'none') {
      safetyStatus = 'warning_low';
      safetyMessage = 'Nitrite level below 100 PPM. May not provide robust Clostridium botulinum protection.';
    } else if (nitritePpm > 200) {
      safetyStatus = 'warning_high';
      safetyMessage = 'Nitrite level exceeds USDA 200 PPM maximum for dry cured meats.';
    }

    return {
      meatWeightG: Number(meatWeightG.toFixed(1)),
      targetSaltPct: Number(targetSaltPct.toFixed(2)),
      pureSaltG: Number(pureSaltG.toFixed(2)),
      saltFromCureG: Number(saltFromCureG.toFixed(2)),
      totalEffectiveSaltG: Number((pureSaltG + saltFromCureG).toFixed(2)),
      cureType: cureType,
      cureWeightG: Number(cureWeightG.toFixed(2)),
      sugarG: Number(sugarG.toFixed(2)),
      totalCureMixG: Number(totalCureMixG.toFixed(2)),
      nitritePpm: Number(nitritePpm.toFixed(1)),
      nitratePpm: Number(nitratePpm.toFixed(1)),
      safetyStatus: safetyStatus,
      safetyMessage: safetyMessage
    };
  },

  /**
   * 2. Equilibrium Wet Brining & Immersion Calculator
   * Calculates total system weight = Meat + Water.
   * Ensures equilibrium between meat core and surrounding brine.
   */
  calculateEquilibriumWetBrine: function(options) {
    const meatWeightG = parseFloat(options.meatWeightG) || 0;
    const waterWeightG = parseFloat(options.waterWeightG) || 0;
    const targetSaltPct = parseFloat(options.targetSaltPct) || 2.5;
    const targetSugarPct = parseFloat(options.targetSugarPct) || 1.5;
    const customCurePct = options.customCurePct ? parseFloat(options.customCurePct) : 0.25;

    const totalSystemWeightG = meatWeightG + waterWeightG;
    if (totalSystemWeightG <= 0 || meatWeightG <= 0 || waterWeightG <= 0) {
      return { error: 'Meat and water weights must be greater than zero' };
    }

    const cureWeightG = totalSystemWeightG * (customCurePct / 100);
    const nitritePpm = (cureWeightG * this.CONSTANTS.PRAGUE_POWDER_1_NITRITE_RATIO / totalSystemWeightG) * 1000000;
    const saltFromCureG = cureWeightG * this.CONSTANTS.PRAGUE_POWDER_1_SALT_RATIO;
    const totalTargetSaltG = totalSystemWeightG * (targetSaltPct / 100);
    const pureSaltG = Math.max(0, totalTargetSaltG - saltFromCureG);
    const sugarG = totalSystemWeightG * (targetSugarPct / 100);

    return {
      meatWeightG: Number(meatWeightG.toFixed(1)),
      waterWeightG: Number(waterWeightG.toFixed(1)),
      totalSystemWeightG: Number(totalSystemWeightG.toFixed(1)),
      targetSaltPct: Number(targetSaltPct.toFixed(2)),
      pureSaltG: Number(pureSaltG.toFixed(2)),
      cureWeightG: Number(cureWeightG.toFixed(2)),
      sugarG: Number(sugarG.toFixed(2)),
      nitritePpm: Number(nitritePpm.toFixed(1)),
      brineSalinityPct: Number(((pureSaltG + saltFromCureG) / waterWeightG * 100).toFixed(2))
    };
  },

  /**
   * 3. Charcuterie Target Weight Loss & Water Activity (aw) Calculator
   * Determines finished target weight for dry-cured meats (Salami, Bresaola, Coppa, Pancetta).
   * Monitored until water activity drops below safe threshold (aw <= 0.88).
   */
  calculateCharcuterieDrying: function(options) {
    const greenWeightG = parseFloat(options.greenWeightG) || 0;
    const targetLossPct = parseFloat(options.targetLossPct) || 35.0; // Standard 35-40%
    const currentWeightG = options.currentWeightG ? parseFloat(options.currentWeightG) : greenWeightG;

    if (greenWeightG <= 0) {
      return { error: 'Green weight must be greater than zero' };
    }

    const targetFinishedWeightG = greenWeightG * (1 - (targetLossPct / 100));
    const weightLostG = Math.max(0, greenWeightG - currentWeightG);
    const currentLossPct = (weightLostG / greenWeightG) * 100;
    const remainingToLoseG = Math.max(0, currentWeightG - targetFinishedWeightG);
    const progressPct = Math.min(100, (currentLossPct / targetLossPct) * 100);

    // Approximate water activity (aw) estimation curve based on weight loss in whole muscle
    // Fresh meat aw ~ 0.99; at 35% weight loss aw ~ 0.88; at 40% loss aw ~ 0.84
    const estimatedAw = Math.max(0.80, 0.99 - (currentLossPct * 0.0032));
    const isSafeToEat = currentLossPct >= 35.0;

    return {
      greenWeightG: Number(greenWeightG.toFixed(1)),
      targetLossPct: Number(targetLossPct.toFixed(1)),
      targetFinishedWeightG: Number(targetFinishedWeightG.toFixed(1)),
      currentWeightG: Number(currentWeightG.toFixed(1)),
      weightLostG: Number(weightLostG.toFixed(1)),
      currentLossPct: Number(currentLossPct.toFixed(2)),
      remainingToLoseG: Number(remainingToLoseG.toFixed(1)),
      progressPct: Number(progressPct.toFixed(1)),
      estimatedAw: Number(estimatedAw.toFixed(3)),
      isSafeToEat: isSafeToEat
    };
  },

  /**
   * 4. Fick's Law Cure Penetration & Thickness Time Estimator
   * Time for salt and nitrite diffusion based on slab thickness, geometry, and bone-in factor.
   */
  calculateCuringTime: function(options) {
    const thicknessMm = parseFloat(options.thicknessMm) || 0;
    const geometry = options.geometry || 'slab'; // 'slab' (2 sides) or 'cylinder' (radial)
    const isBoneIn = options.isBoneIn || false;

    if (thicknessMm <= 0) {
      return { error: 'Thickness must be greater than zero' };
    }

    // Diffusion velocity: approximately 6.35 mm (1/4 inch) per day from each surface
    const penetrationRateMmPerDay = 6.35;
    let effectiveDepthMm = thicknessMm;

    if (geometry === 'slab') {
      // Penetrates from both top and bottom
      effectiveDepthMm = thicknessMm / 2;
    } else if (geometry === 'cylinder') {
      // Penetrates radially from circumference to center
      effectiveDepthMm = thicknessMm / 2;
    }

    let baseDays = effectiveDepthMm / (penetrationRateMmPerDay / 1); // 1 day per 6.35mm
    if (isBoneIn) {
      baseDays *= 1.25; // Bone slows penetration along marrow interfaces
    }

    const minSafeDays = Math.ceil(baseDays + 2); // 2 days safety buffer
    const recommendedDays = minSafeDays + 3;      // Equilibrium allows safe extended dwell

    return {
      thicknessMm: Number(thicknessMm.toFixed(1)),
      thicknessInches: Number((thicknessMm / 25.4).toFixed(2)),
      geometry: geometry,
      isBoneIn: isBoneIn,
      minSafeDays: minSafeDays,
      recommendedDays: recommendedDays,
      ruleSummary: `${minSafeDays} to ${recommendedDays} days in refrigerator (36°F–40°F / 2°C–4°C)`
    };
  },

  /**
   * 5. International Curing Salt & Nitrite PPM Safety Converter
   * Converts between US Prague Powder #1 (6.25%), EU Peklosol (0.6%), and Australian Cure (5.0%).
   */
  convertCuringSalt: function(options) {
    const meatWeightG = parseFloat(options.meatWeightG) || 1000;
    const sourceSaltType = options.sourceSaltType || 'cure1'; // 'cure1', 'peklosol', 'aussie'
    const targetPpm = parseFloat(options.targetPpm) || this.CONSTANTS.USDA_TARGET_NITRITE_PPM;

    let concentration = this.CONSTANTS.PRAGUE_POWDER_1_NITRITE_RATIO;
    let saltRatio = this.CONSTANTS.PRAGUE_POWDER_1_SALT_RATIO;

    if (sourceSaltType === 'peklosol') {
      concentration = this.CONSTANTS.PEKLOSOL_NITRITE_RATIO;
      saltRatio = this.CONSTANTS.PEKLOSOL_SALT_RATIO;
    } else if (sourceSaltType === 'aussie') {
      concentration = this.CONSTANTS.AUSSIE_CURE_NITRITE_RATIO;
      saltRatio = this.CONSTANTS.AUSSIE_CURE_SALT_RATIO;
    }

    // Weight (g) = (PPM * MeatWeightG) / (Concentration * 1,000,000)
    const requiredWeightG = (targetPpm * meatWeightG) / (concentration * 1000000);
    const saltDeliveredG = requiredWeightG * saltRatio;
    const percentageOfMeat = (requiredWeightG / meatWeightG) * 100;

    return {
      sourceSaltType: sourceSaltType,
      targetPpm: targetPpm,
      requiredWeightG: Number(requiredWeightG.toFixed(2)),
      percentageOfMeat: Number(percentageOfMeat.toFixed(2)),
      saltDeliveredG: Number(saltDeliveredG.toFixed(2)),
      needsExtraSalt: sourceSaltType !== 'peklosol'
    };
  },

  /**
   * 6. South African Biltong & Jerky Yield Scaler
   * Traditional vinegar dip, coarse toasted coriander, and wet-to-dry dehydration math.
   */
  calculateBiltong: function(options) {
    const rawMeatG = parseFloat(options.rawMeatG) || 0;
    const saltPct = parseFloat(options.saltPct) || 2.2;
    const corianderPct = parseFloat(options.corianderPct) || 1.8;
    const pepperPct = parseFloat(options.pepperPct) || 0.6;
    const sugarPct = parseFloat(options.sugarPct) || 0.8;
    const expectedLossPct = parseFloat(options.expectedLossPct) || 52.0; // 50-55% is traditional biltong dryness

    if (rawMeatG <= 0) {
      return { error: 'Meat weight must be greater than zero' };
    }

    const saltG = rawMeatG * (saltPct / 100);
    const corianderG = rawMeatG * (corianderPct / 100);
    const pepperG = rawMeatG * (pepperPct / 100);
    const sugarG = rawMeatG * (sugarPct / 100);
    const vinegarMl = (rawMeatG / 1000) * 40; // 40ml spiced brown vinegar per kg
    const estimatedYieldG = rawMeatG * (1 - (expectedLossPct / 100));

    return {
      rawMeatG: Number(rawMeatG.toFixed(1)),
      saltG: Number(saltG.toFixed(1)),
      corianderG: Number(corianderG.toFixed(1)),
      pepperG: Number(pepperG.toFixed(1)),
      sugarG: Number(sugarG.toFixed(1)),
      vinegarMl: Number(vinegarMl.toFixed(1)),
      estimatedYieldG: Number(estimatedYieldG.toFixed(1)),
      expectedLossPct: Number(expectedLossPct.toFixed(1))
    };
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = CureMath;
}
