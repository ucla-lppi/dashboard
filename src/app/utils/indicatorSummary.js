// src/utils/indicatorSummary.js

export const assignIndicatorSummary = (features) => {
	return features.map((feature, index) => {
	  let extremeHeat, pollutionBurden;
  
	  if (index < 5) {
		extremeHeat = 'low';
		pollutionBurden = 'low';
	  } else if (index < 10) {
		extremeHeat = 'medium';
		pollutionBurden = 'medium';
	  } else {
		extremeHeat = 'high';
		pollutionBurden = 'high';
	  }
  
	  const latinoPopulation = Math.floor(Math.random() * 100) + 1; // Random Latino population between 1 and 100
	  const whitePopulation = 100 - latinoPopulation; // Remaining percentage for White population
  
	  return {
		...feature,
		properties: {
		  ...feature.properties,
		  extremeHeat,
		  pollutionBurden,
		  latinoPopulation,
		  whitePopulation,
		}
	  };
	});
  };