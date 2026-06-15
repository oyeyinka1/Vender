// Nigerian Locations: 36 States + FCT with Zones and Neighbourhoods
const LOCATIONS = {
  "Lagos": {
    zones: {
      "Lagos Island": ["Lagos Island", "Victoria Island", "Lekki Phase 1", "Ajah", "Ikoyi"],
      "Lagos Mainland": ["Yaba", "Surulere", "Ikeja", "Maryland", "Oshodi", "Mushin"],
      "Ikorodu": ["Ikorodu Town", "Agric", "Imota", "Bayeku", "Ijede"],
      "Badagry": ["Badagry", "Ajara", "Seme"],
      "Epe": ["Epe Town", "Agbowa"],
      "Lekki": ["Lekki Phase 2", "Lekki Phase 3", "Ajah", "Sangotedo", "Eta"]
    }
  },
  "Abuja (FCT)": {
    zones: {
      "Central": ["Wuse", "Garki", "Asokoro", "Maitama"],
      "North": ["Gwarinpa", "Kubwa", "Karu", "Nyanya"],
      "South": ["Lugbe", "Gwagwalada", "Kuje"],
      "West": ["Utako", "Gudu", "Kaura"]
    }
  },
  "Abia": {
    zones: {
      "Umuahia": ["Umuahia North", "Umuahia South", "Ubakala", "Amafor"],
      "Aba": ["Aba North", "Aba South", "Osisioma"]
    }
  },
  "Adamawa": {
    zones: {
      "Yola": ["Yola North", "Yola South", "Girei"],
      "Mubi": ["Mubi North", "Mubi South"],
      "Guyuk": ["Guyuk", "Shelleng"]
    }
  },
  "Akwa Ibom": {
    zones: {
      "Uyo": ["Uyo", "Ini", "Ikot Ekpene"],
      "Eket": ["Eket", "Essien Udim", "Okobo"]
    }
  },
  "Anambra": {
    zones: {
      "Onitsha": ["Onitsha North", "Onitsha South", "Ogidi"],
      "Awka": ["Awka North", "Awka South", "Enugu North"],
      "Nnewi": ["Nnewi North", "Nnewi South", "Ekwusigo"]
    }
  },
  "Bauchi": {
    zones: {
      "Bauchi City": ["Bauchi", "Tafawa Balewa", "Toro"],
      "Gombe": ["Gombe North", "Gombe South"]
    }
  },
  "Bayelsa": {
    zones: {
      "Yenagoa": ["Yenagoa", "Brass", "Sagbama"],
      "Warri": ["Southern Ijaw", "Nembe"]
    }
  },
  "Benue": {
    zones: {
      "Makurdi": ["Makurdi", "Gboko", "Tor"],
      "Tiv Land": ["Guma", "Gwer", "Otukpo"]
    }
  },
  "Borno": {
    zones: {
      "Maiduguri": ["Maiduguri Metropolitan", "Jere", "Konduga"],
      "Damaturu": ["Yobe", "Tarmuwa"]
    }
  },
  "Cross River": {
    zones: {
      "Calabar": ["Calabar Municipality", "Calabar South", "Akamkpa"],
      "Ogoja": ["Ogoja", "Oban", "Yala"]
    }
  },
  "Delta": {
    zones: {
      "Warri": ["Warri North", "Warri South", "Effurun"],
      "Asaba": ["Asaba", "Isoko", "Aniocha"],
      "Sapele": ["Sapele", "Uvwie", "Ughelli"]
    }
  },
  "Ebonyi": {
    zones: {
      "Abakaliki": ["Abakaliki", "Ebonyi", "Ezza"],
      "Onueke": ["Onueke", "Ohaozara"]
    }
  },
  "Edo": {
    zones: {
      "Benin City": ["Benin City", "Egor", "Oredo"],
      "Sapele Road": ["Orhionmwon", "Uhunmwonde"],
      "Auchi": ["Etsako Central", "Etsako West"]
    }
  },
  "Ekiti": {
    zones: {
      "Ado-Ekiti": ["Ado-Ekiti", "Irepodun", "Ikere"],
      "Ijero": ["Ijero-Ekiti", "Oye-Ekiti"]
    }
  },
  "Enugu": {
    zones: {
      "Enugu City": ["Enugu North", "Enugu South", "Igbo-Etiti"],
      "Nsukka": ["Nsukka", "Igbo-Eze North"],
      "Nkanu": ["Nkanu East", "Nkanu West"]
    }
  },
  "Gombe": {
    zones: {
      "Gombe City": ["Gombe", "Yamaltu/Deba"],
      "Kumo": ["Kundu", "Billiri"]
    }
  },
  "Imo": {
    zones: {
      "Owerri": ["Owerri North", "Owerri West", "Owerri Municipal"],
      "Orlu": ["Orlu", "Orsu", "Ideato"],
      "Okigwe": ["Okigwe", "Onuimo"]
    }
  },
  "Jigawa": {
    zones: {
      "Dutse": ["Dutse", "Birniwa"],
      "Kazaure": ["Kazaure", "Kiyawa"],
      "Hadejia": ["Hadejia", "Auyo"]
    }
  },
  "Kaduna": {
    zones: {
      "Kaduna City": ["Kaduna North", "Kaduna South", "Chikun"],
      "Zaria": ["Zaria", "Sabon Gari", "Igabi"],
      "Kafanchan": ["Kafanchan", "Kaura", "Jema'a"]
    }
  },
  "Kano": {
    zones: {
      "Kano City": ["Kano Municipal", "Tarauni", "Fagge"],
      "Kura": ["Kura", "Garun Mallam"],
      "Bompai": ["Nassarawa", "Dala"]
    }
  },
  "Katsina": {
    zones: {
      "Katsina City": ["Katsina", "Kachalari", "Funtua"],
      "Daura": ["Daura", "Zango"],
      "Kastina South": ["Kaita", "Jibia"]
    }
  },
  "Kebbi": {
    zones: {
      "Birnin Kebbi": ["Birnin Kebbi", "Gwandu"],
      "Argungu": ["Argungu", "Bagudo"],
      "Sokoto": ["Arewa", "Yauri"]
    }
  },
  "Kogi": {
    zones: {
      "Lokoja": ["Lokoja", "Kogi", "Ajaokuta"],
      "Okene": ["Okene", "Okehi", "Ijumu"],
      "Idah": ["Idah", "Igalamela-Odolu"]
    }
  },
  "Kwara": {
    zones: {
      "Ilorin": ["Ilorin West", "Ilorin South", "Ilorin East"],
      "Offa": ["Offa", "Oyun"],
      "Pategi": ["Pategi", "Edu"]
    }
  },
  "Lagos (detailed)": {
    zones: {
      "Lagos Island": ["Lagos Island", "Victoria Island", "Lekki Phase 1", "Ajah", "Ikoyi"],
      "Lagos Mainland": ["Yaba", "Surulere", "Ikeja", "Maryland", "Oshodi", "Mushin"],
      "Ikorodu": ["Ikorodu Town", "Agric", "Imota", "Bayeku", "Ijede"],
      "Badagry": ["Badagry", "Ajara", "Seme"],
      "Epe": ["Epe Town", "Agbowa"]
    }
  },
  "Nasarawa": {
    zones: {
      "Lafia": ["Lafia", "Obi"],
      "Keffi": ["Keffi", "Kokona"],
      "Nasarawa": ["Nasarawa", "Karu"]
    }
  },
  "Niger": {
    zones: {
      "Minna": ["Minna", "Suleja", "Chanchaga"],
      "Bida": ["Bida", "Katcha"],
      "Kagara": ["Kagara", "Gurara"]
    }
  },
  "Ogun": {
    zones: {
      "Abeokuta": ["Abeokuta North", "Abeokuta South", "Obafemi-Owode"],
      "Ijebu-Ode": ["Ijebu-Ode", "Ijebu-East", "Ijebu-North"],
      "Sagamu": ["Sagamu", "Remo-North"]
    }
  },
  "Ondo": {
    zones: {
      "Akure": ["Akure North", "Akure South", "Owo"],
      "Oshogbo": ["Osogbo", "Ijesaland"],
      "Ore": ["Odigbo", "Irele"]
    }
  },
  "Osun": {
    zones: {
      "Osogbo": ["Osogbo", "Iwo", "Ede"],
      "Ilesha": ["Ilesha East", "Ilesha West", "Irepodun"],
      "Ikirun": ["Ifelodun", "Atakumosa"]
    }
  },
  "Oyo": {
    zones: {
      "Ibadan": ["Ibadan North", "Ibadan South", "Ido", "Ibarapa"],
      "Oyo Town": ["Oyo West", "Oyo East"],
      "Ogbomoso": ["Ogbomoso North", "Ogbomoso South"]
    }
  },
  "Plateau": {
    zones: {
      "Jos": ["Jos North", "Jos South", "Jos East"],
      "Bukuru": ["Bukuru", "Mangu"],
      "Pankshin": ["Pankshin", "Kandy"]
    }
  },
  "Rivers": {
    zones: {
      "Port Harcourt": ["Port Harcourt City", "Obio/Akpor", "Okrika"],
      "Aba-Owerri": ["Eleme", "Tai", "Gokana"],
      "Calabar": ["Ogoni", "Opobo-Nchia"]
    }
  },
  "Sokoto": {
    zones: {
      "Sokoto City": ["Sokoto North", "Sokoto South", "Gada"],
      "Gusau": ["Gudu", "Bodinga"],
      "Tambuwal": ["Tambuwal", "Silame"]
    }
  },
  "Taraba": {
    zones: {
      "Jalingo": ["Jalingo", "Zing"],
      "Wukari": ["Wukari", "Takum"],
      "Gembu": ["Gembu", "Sardauna"]
    }
  },
  "Yobe": {
    zones: {
      "Damaturu": ["Damaturu", "Potiskum"],
      "Geidam": ["Geidam", "Karasuwa"],
      "Nguru": ["Nguru", "Katagum"]
    }
  },
  "Zamfara": {
    zones: {
      "Gusau": ["Gusau", "Magama"],
      "Zaria": ["Tsafe", "Bakura"],
      "Kukar-Gida": ["Anka", "Maru"]
    }
  },
  "Sokoto (FCT)": {
    zones: {
      "Sokoto City": ["Sokoto North", "Sokoto South", "Gada"],
      "Gusau": ["Gudu", "Bodinga"],
      "Tambuwal": ["Tambuwal", "Silame"]
    }
  }
};

// Helper function to get all states
function getAllStates() {
  return Object.keys(LOCATIONS).sort();
}

// Helper function to get zones for a state
function getZones(state) {
  if (!LOCATIONS[state]) return [];
  return Object.keys(LOCATIONS[state].zones);
}

// Helper function to get neighbourhoods for a state + zone
function getNeighbourhoods(state, zone) {
  if (!LOCATIONS[state] || !LOCATIONS[state].zones[zone]) return [];
  return LOCATIONS[state].zones[zone];
}
