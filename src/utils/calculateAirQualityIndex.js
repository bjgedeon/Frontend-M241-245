function calculateAirQualityIndex(voc, gas, humidity) {
  let iaq = 0;

  if (voc < 50) iaq += 0;
  else if (voc < 100) iaq += 30;
  else if (voc < 200) iaq += 60;
  else if (voc < 400) iaq += 90;
  else iaq += 120;

  if (gas < 300) iaq += 0;
  else if (gas < 500) iaq += 30;
  else if (gas < 1000) iaq += 60;
  else if (gas < 1500) iaq += 90;
  else iaq += 120;

  if (humidity >= 30 && humidity <= 60) {
    iaq += 0;
  } else if ((humidity >= 20 && humidity < 30) || (humidity > 60 && humidity <= 70)) {
    iaq += 10;
  } else {
    iaq += 20;
  }

  return Math.min(Math.round((iaq / 260) * 500), 500);
}

export default calculateAirQualityIndex;
