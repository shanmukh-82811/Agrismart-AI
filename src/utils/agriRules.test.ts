import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateIndianMobile,
  generateOtp,
  verifyOtp,
  calculatePesticideDosage,
  calculateDroneFlightMetrics,
  checkSchemeEligibility,
  searchCatalog,
} from './agriRules.ts';

test('validateIndianMobile validates valid 10-digit Indian numbers', () => {
  const res1 = validateIndianMobile('9848012345');
  assert.equal(res1.valid, true);
  assert.equal(res1.cleanNumber, '9848012345');
  assert.equal(res1.formatted, '+91 98480 12345');

  const resWithCountry = validateIndianMobile('+91 9876543210');
  assert.equal(resWithCountry.valid, true);
  assert.equal(resWithCountry.cleanNumber, '9876543210');

  const resWithSpaces = validateIndianMobile('87654 32109');
  assert.equal(resWithSpaces.valid, true);
  assert.equal(resWithSpaces.cleanNumber, '8765432109');
});

test('validateIndianMobile rejects invalid numbers', () => {
  const shortNum = validateIndianMobile('12345');
  assert.equal(shortNum.valid, false);
  assert.ok(shortNum.error);

  const invalidStart = validateIndianMobile('4848012345'); // Starts with 4
  assert.equal(invalidStart.valid, false);

  const letters = validateIndianMobile('abcdefghij');
  assert.equal(letters.valid, false);
});

test('generateOtp creates 6-digit string', () => {
  const otp = generateOtp('9848012345', 100);
  assert.equal(typeof otp, 'string');
  assert.equal(otp.length, 6);
  assert.ok(/^\d{6}$/.test(otp));
});

test('verifyOtp handles expected and demo OTP correctly', () => {
  assert.equal(verifyOtp('482910', '999999').success, true); // Demo OTP allowed
  assert.equal(verifyOtp('123456', '999999').success, true); // Demo alternate
  assert.equal(verifyOtp('888888', '888888').success, true); // Exact match
  assert.equal(verifyOtp('000000', '888888').success, false); // Mismatch
  assert.equal(verifyOtp('12', '888888').success, false); // Too short
});

test('calculatePesticideDosage computes water and cost savings', () => {
  const dosage = calculatePesticideDosage('paddy', 'blast', 2);
  assert.equal(dosage.chemicalName, 'Tricyclazole 75% WP (Baan)');
  assert.equal(dosage.totalWaterLiters, 24); // 2 acres * 12 L
  assert.equal(dosage.manualWaterLiters, 320); // 2 acres * 160 L
  assert.ok(dosage.waterSavingsPercent > 90);
  assert.equal(dosage.subsidizedDroneCostInr, 300); // 2 * 150
  assert.equal(dosage.marketSprayCostInr, 1300); // 2 * 650
});

test('calculateDroneFlightMetrics calculates telemetry properly', () => {
  const metrics = calculateDroneFlightMetrics(2.5, 'spray');
  assert.ok(metrics.flightMinutes > 0);
  assert.ok(metrics.batteryDrainPercent > 0);
  assert.ok(metrics.waterSavedLiters > 300);
  assert.ok(metrics.co2ReductionKg > 0);
});

test('checkSchemeEligibility enforces land ceilings', () => {
  const eligibleSmall = checkSchemeEligibility({ landHoldingAcres: 3, mandal: 'Anakapalle' }, 'rythu bharosa');
  assert.equal(eligibleSmall.eligible, true);

  const ineligibleLarge = checkSchemeEligibility({ landHoldingAcres: 15, mandal: 'Anakapalle' }, 'rythu bharosa');
  assert.equal(ineligibleLarge.eligible, false);

  const droneSubsidy = checkSchemeEligibility({ landHoldingAcres: 5 }, 'subsidized drone');
  assert.equal(droneSubsidy.eligible, true);
});

test('searchCatalog filters items accurately', () => {
  const items = [
    { title: 'Paddy Rice Blast', category: 'Fungus', tags: ['rice', 'blast', 'leaf'] },
    { title: 'Sugarcane Red Rot', category: 'Fungus', tags: ['cane', 'sugar', 'rot'] },
    { title: 'Tractor Rent 45HP', category: 'Equipment', tags: ['tilling', 'rotavator'] },
  ];

  const results1 = searchCatalog(items, 'blast', ['title', 'tags']);
  assert.equal(results1.length, 1);
  assert.equal(results1[0].title, 'Paddy Rice Blast');

  const results2 = searchCatalog(items, 'sugar', ['title', 'tags']);
  assert.equal(results2.length, 1);
  assert.equal(results2[0].title, 'Sugarcane Red Rot');

  const resultsAll = searchCatalog(items, '', ['title']);
  assert.equal(resultsAll.length, 3);
});
