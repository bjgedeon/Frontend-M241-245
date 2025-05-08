function calculateAirQualityIndex(voc, gas, humidity) {
    let iaq = 0;
  
    // VOC-Bewertung
    if (voc < 50) iaq += 10;
    else if (voc < 100) iaq += 30;
    else if (voc < 200) iaq += 60;
    else iaq += 100;
  
    // Gas-Bewertung
    if (gas < 300) iaq += 10;
    else if (gas < 500) iaq += 30;
    else if (gas < 1000) iaq += 60;
    else iaq += 100;
  
    // Luftfeuchtigkeit (optimal 30–60 %)
    if (humidity >= 30 && humidity <= 60) iaq += 0;
    else iaq += 20;
  
    return Math.min(Math.round((iaq / 220) * 500), 500);
  }
  
  export default calculateAirQualityIndex;
  