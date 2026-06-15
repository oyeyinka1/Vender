// locations.js — Vender Nigeria
// All 36 states + FCT with real zones and neighbourhoods
// Structure: LOCATION_DATA[state][zone] = [neighbourhoods]

const LOCATION_DATA = {
  "Lagos": {
    "Lagos Island": [
      "Lagos Island", "Victoria Island (VI)", "Ikoyi", "Oniru",
      "Lekki Phase 1", "Lekki Phase 2", "Ajah", "Sangotedo",
      "Chevron", "Ikate", "Osapa London", "Jakande"
    ],
    "Lagos Mainland": [
      "Yaba", "Surulere", "Ikeja", "Maryland", "Oshodi",
      "Mushin", "Agege", "Ilupeju", "Shomolu", "Bariga",
      "Somolu", "Gbagada", "Anthony Village", "Palmgrove",
      "Oregun", "Allen Avenue", "Ogba"
    ],
    "Ikorodu": [
      "Ikorodu Town", "Agric", "Imota", "Bayeku",
      "Ijede", "Ipakodo", "Odogunyan", "Igbogbo", "Isawo"
    ],
    "Badagry": [
      "Badagry", "Ajara", "Seme", "Agbara", "Ojo",
      "Alaba International", "Satellite Town"
    ],
    "Epe": [
      "Epe Town", "Agbowa", "Poka", "Ejinrin", "Itoikin"
    ]
  },

  "Abuja (FCT)": {
    "Central District": [
      "Wuse", "Wuse 2", "Garki", "Garki 2", "Asokoro",
      "Maitama", "Guzape", "Central Business District (CBD)",
      "Utako", "Jabi", "Kado"
    ],
    "North District": [
      "Gwarinpa", "Kubwa", "Karu", "Nyanya", "Dutse",
      "Karmo", "Gaduwa", "Dawaki", "Lifecamp",
      "Lokogoma", "Lugbe", "Galadimawa"
    ],
    "South District": [
      "Gwagwalada", "Kuje", "Bwari", "Abaji",
      "Kwali", "Zuba", "Airport Road"
    ],
    "Satellite Towns": [
      "Lugbe", "Galadimawa", "Apo", "Gudu",
      "Katampe", "Mpape", "Jukwoyi"
    ]
  },

  "Rivers": {
    "Port Harcourt City": [
      "GRA Phase 1", "GRA Phase 2", "GRA Phase 3",
      "Rumuola", "Aba Road", "Diobu", "Rumuokoro",
      "Rumuigbo", "Trans Amadi", "Woji", "Eleme",
      "Borikiri", "Town", "Mile 1", "Mile 2", "Mile 3"
    ],
    "Obio-Akpor": [
      "Rumuodara", "Rukpokwu", "Rumola", "Eneka",
      "Rumuokwuta", "Rumuibekwe", "Mgbuodohia",
      "Ozuoba", "Choba"
    ],
    "Ikwerre": [
      "Isiokpo", "Igwuruta", "Chokocho", "Elele"
    ],
    "Etche": [
      "Okehi", "Afam", "Umueze"
    ]
  },

  "Kano": {
    "Kano Municipal": [
      "Fagge", "Dala", "Gwale", "Kofar Mata",
      "Kurawa", "Naibawa", "Yankaba"
    ],
    "Nassarawa": [
      "Nasarawa GRA", "Zoo Road", "Bompai",
      "Sharada", "Tudun Wada"
    ],
    "Tarauni": [
      "Tarauni", "Hotoro", "Dorayi", "Kabuga"
    ],
    "Ungogo": [
      "Ungogo", "Badawa", "Kiru Road"
    ],
    "Kumbotso": [
      "Kumbotso", "Airport Road Kano", "Dakata"
    ]
  },

  "Oyo": {
    "Ibadan North": [
      "Bodija", "UI (University of Ibadan area)", "Agodi",
      "Jericho", "Iyaganku", "Agodi GRA", "Dugbe",
      "Challenge", "Oke-Ado"
    ],
    "Ibadan South-West": [
      "Molete", "Ring Road", "Adamasingba",
      "Oluyole", "Iyaganku GRA", "Oke Ibadan"
    ],
    "Ibadan South-East": [
      "Oja Oba", "Mapo", "Agbeni", "Iwo Road",
      "Oke-Padre", "Mokola"
    ],
    "Ibadan North-West": [
      "Sango", "Ojoo", "Moniya", "Apata",
      "Abebi", "Felele"
    ],
    "Ogbomoso": [
      "Ogbomoso Town", "Arowomole", "Takie", "Oja Igbo"
    ],
    "Oyo Town": [
      "Oyo Town", "Owode", "Ojongbodu"
    ]
  },

  "Anambra": {
    "Onitsha": [
      "Onitsha Main Market area", "Fegge", "Inland Town",
      "GRA Onitsha", "Woliwo", "Odoakpu", "Awada"
    ],
    "Awka": [
      "Awka Town", "Unizik Junction", "Ifite Road",
      "GRA Awka", "Amawbia", "Agu-Awka"
    ],
    "Nnewi": [
      "Nnewi Town", "Otolo", "Uruagu", "Umudim", "Nnewichi"
    ],
    "Ekwulobia": [
      "Ekwulobia", "Aguata", "Igboukwu"
    ]
  },

  "Kwara": {
    "Ilorin South": [
      "Ilorin Town", "Taiwo Road", "Fate Road",
      "Oja Oba", "Surulere Ilorin", "Unity Road"
    ],
    "Ilorin West": [
      "GRA Ilorin", "Offa Garage", "Oke-Oyi",
      "Tanke", "Sawmill", "Basin"
    ],
    "Ilorin East": [
      "Ipata", "Kulende", "Okelele",
      "Adeta", "Coca-Cola area"
    ],
    "Offa": [
      "Offa Town", "Eiyenkorin", "Ojoku"
    ],
    "Kwara South": [
      "Jebba", "Patigi", "Kaiama", "Lafiagi"
    ]
  },

  "Enugu": {
    "Enugu North": [
      "GRA Enugu", "Independence Layout",
      "Trans Ekulu", "Achara Layout", "New Haven"
    ],
    "Enugu South": [
      "Ogui Road", "Coal Camp", "Iva Valley",
      "Obiagu", "Asata"
    ],
    "Enugu East": [
      "Abakpa Nike", "Emene", "Gariki", "Thinkers Corner"
    ],
    "Awgu": [
      "Awgu Town", "Agbogugu", "Oji River"
    ]
  },

  "Delta": {
    "Warri": [
      "Warri Town", "GRA Warri", "Effurun",
      "Ekpan", "Ugborikoko", "Pessu", "Okumagba Layout"
    ],
    "Asaba": [
      "Asaba Town", "GRA Asaba", "Okpanam Road",
      "Infant Jesus", "Cable Point", "High Level"
    ],
    "Sapele": [
      "Sapele Town", "Amukpe", "Okirigwe"
    ],
    "Ughelli": [
      "Ughelli Town", "Agbarha", "Otor-Ughelli"
    ]
  },

  "Edo": {
    "Benin City": [
      "GRA Benin", "New Benin", "Uselu",
      "Oregbeni", "Ikpoba Hill", "Ekosodin",
      "Ugbowo", "Ring Road Benin", "Sapele Road Benin",
      "Aduwawa", "Siluko Road"
    ],
    "Ekpoma": [
      "Ekpoma Town", "Iruekpen", "Ubiaja"
    ],
    "Auchi": [
      "Auchi Town", "Jattu", "Fugar"
    ]
  },

  "Imo": {
    "Owerri Municipal": [
      "Owerri Town", "GRA Owerri", "Ikenegbu Layout",
      "Uratta Road", "Douglas Road", "Wetheral Road",
      "Akachi Road", "Relief Market area"
    ],
    "Owerri North": [
      "Avu", "Egbeada", "Ohaji"
    ],
    "Orlu": [
      "Orlu Town", "Okwudor", "Nkwerre"
    ],
    "Okigwe": [
      "Okigwe Town", "Ihube", "Nsu"
    ]
  },

  "Ogun": {
    "Abeokuta": [
      "Abeokuta Town", "Ibara", "Sapon", "Panseke",
      "Oke-Ilewo", "Kuto", "Lafenwa", "Ijaye",
      "Asero", "Onikolobo"
    ],
    "Sagamu": [
      "Sagamu Town", "Ogijo", "Makun", "Ikorodu Road Sagamu"
    ],
    "Ijebu-Ode": [
      "Ijebu-Ode Town", "Oru", "Ago-Iwoye"
    ],
    "Ota": [
      "Ota Town", "Sango-Ota", "Agbara", "Ifo"
    ],
    "Ilaro": [
      "Ilaro Town", "Ayetoro", "Owode"
    ]
  },

  "Kaduna": {
    "Kaduna North": [
      "Tudun Wada Kaduna", "Badiko", "Kawo",
      "Trikania", "Ungwan Rimi"
    ],
    "Kaduna South": [
      "Barnawa", "Kakuri", "Gonin Gora",
      "Television", "Kabala Costain"
    ],
    "GRA Kaduna": [
      "Kaduna GRA", "Ungwan Sarki", "Malali",
      "Nasarawa Kaduna"
    ],
    "Zaria": [
      "Zaria City", "Sabon Gari Zaria", "Samaru",
      "ABU Campus area"
    ]
  },

  "Plateau": {
    "Jos North": [
      "Jos Town", "Tudun Wada Jos", "Nassarawa Gwong",
      "Yan Trailer", "Terminus"
    ],
    "Jos South": [
      "Rayfield", "Anglo-Jos", "Bukuru",
      "Kuru", "Shen"
    ],
    "Jos East": [
      "Dong", "Vom", "Barkin Ladi"
    ],
    "Pankshin": [
      "Pankshin Town", "Kanke", "Kanam"
    ]
  },

  "Cross River": {
    "Calabar Municipal": [
      "Calabar Town", "GRA Calabar", "Satellite Town Calabar",
      "Watt Market area", "Marian Road", "Edim Otop"
    ],
    "Calabar South": [
      "Diamond Hill", "Etagberi", "Ikang Road",
      "State Housing Calabar"
    ],
    "Ogoja": [
      "Ogoja Town", "Obudu", "Ikom"
    ]
  },

  "Akwa Ibom": {
    "Uyo": [
      "Uyo Town", "GRA Uyo", "Itam",
      "Wellington Bassey Way", "Stadium Road",
      "Ewet Housing", "Shelter Afrique"
    ],
    "Eket": [
      "Eket Town", "Oron", "Ikot Abasi"
    ],
    "Ikot Ekpene": [
      "Ikot Ekpene Town", "Abak", "Ikot Akpaden"
    ]
  },

  "Bayelsa": {
    "Yenagoa": [
      "Yenagoa Town", "Biogbolo", "Ekeki",
      "Opolo", "Swali", "Kpansia", "Onopa",
      "Elebele Road", "Tombia Road"
    ],
    "Ogbia": [
      "Oloibiri", "Nembe", "Brass"
    ]
  },

  "Benue": {
    "Makurdi": [
      "Makurdi Town", "GRA Makurdi", "North Bank",
      "Wadata", "High Level Makurdi", "Wurukum",
      "Ankpa Quarters"
    ],
    "Gboko": [
      "Gboko Town", "Yandev"
    ],
    "Otukpo": [
      "Otukpo Town", "Ugbokolo"
    ]
  },

  "Abia": {
    "Umuahia": [
      "Umuahia Town", "GRA Umuahia", "Ubani",
      "Umuola Road", "Federal Road", "Orieagu"
    ],
    "Aba": [
      "Aba Town", "Ariaria Market area", "Ngwa Road",
      "Ogbor Hill", "Eziama", "Port Harcourt Road Aba",
      "Uratta Road Aba"
    ],
    "Ohafia": [
      "Ohafia Town", "Arochukwu"
    ]
  },

  "Osun": {
    "Osogbo": [
      "Osogbo Town", "GRA Osogbo", "Oke-Fia",
      "Alekuwodo", "Station Road Osogbo"
    ],
    "Ile-Ife": [
      "Ile-Ife Town", "OAU Campus area", "Lagere",
      "Mayfair"
    ],
    "Ilesa": [
      "Ilesa Town", "Imo Ilesa", "Efon Alaaye"
    ]
  },

  "Ondo": {
    "Akure": [
      "Akure Town", "GRA Akure", "Alagbaka",
      "Oda Road", "FUTA area", "Ijapo Estate"
    ],
    "Ondo City": [
      "Ondo Town", "Bolorunduro"
    ],
    "Owo": [
      "Owo Town", "Ikare"
    ]
  },

  "Ekiti": {
    "Ado-Ekiti": [
      "Ado-Ekiti Town", "GRA Ado-Ekiti", "Basiri",
      "Ajilosun", "Ilawe Road", "EKSU area"
    ],
    "Ikere-Ekiti": [
      "Ikere Town", "Igbara-Oke"
    ],
    "Ikole-Ekiti": [
      "Ikole Town", "Omuo Ekiti"
    ]
  },

  "Kogi": {
    "Lokoja": [
      "Lokoja Town", "GRA Lokoja", "Ganaja",
      "Adankolo", "Felele Lokoja", "Phase 2 Lokoja"
    ],
    "Ankpa": [
      "Ankpa Town", "Dekina"
    ],
    "Okene": [
      "Okene Town", "Ihima", "Ajaokuta"
    ]
  },

  "Nasarawa": {
    "Lafia": [
      "Lafia Town", "GRA Lafia", "Agwan Bassa",
      "New Market Lafia", "Citizen's Corner"
    ],
    "Keffi": [
      "Keffi Town", "NSUK area"
    ],
    "Akwanga": [
      "Akwanga Town", "Wamba"
    ]
  },

  "Niger": {
    "Minna": [
      "Minna Town", "GRA Minna", "Tudun Wada Minna",
      "Bosso", "Chanchaga", "Kpakungu"
    ],
    "Suleja": [
      "Suleja Town", "Tunga", "Maje"
    ],
    "Bida": [
      "Bida Town", "Lapai"
    ],
    "Kontagora": [
      "Kontagora Town"
    ]
  },

  "Kebbi": {
    "Birnin Kebbi": [
      "Birnin Kebbi Town", "GRA Birnin Kebbi",
      "Jega Road", "Kalgo Road"
    ],
    "Argungu": [
      "Argungu Town"
    ],
    "Yauri": [
      "Yauri Town", "Koko"
    ]
  },

  "Sokoto": {
    "Sokoto North": [
      "Sokoto Town", "GRA Sokoto", "Gawon Nama",
      "Runjin Sambo", "Minanata"
    ],
    "Sokoto South": [
      "Tudun Wada Sokoto", "Mabera", "Arkilla"
    ],
    "Tambuwal": [
      "Tambuwal Town", "Illela"
    ]
  },

  "Zamfara": {
    "Gusau": [
      "Gusau Town", "GRA Gusau", "Tudun Wada Gusau",
      "Sabon Gari Gusau"
    ],
    "Kaura Namoda": [
      "Kaura Namoda Town"
    ],
    "Talata Mafara": [
      "Talata Mafara Town"
    ]
  },

  "Jigawa": {
    "Dutse": [
      "Dutse Town", "GRA Dutse", "Gwaram Road"
    ],
    "Hadejia": [
      "Hadejia Town", "Gumel"
    ],
    "Kazaure": [
      "Kazaure Town"
    ]
  },

  "Katsina": {
    "Katsina City": [
      "Katsina Town", "GRA Katsina", "Sabon Gari Katsina",
      "Dandagoro", "Kofar Kaura"
    ],
    "Daura": [
      "Daura Town"
    ],
    "Funtua": [
      "Funtua Town"
    ]
  },

  "Yobe": {
    "Damaturu": [
      "Damaturu Town", "GRA Damaturu",
      "Waziri Ibrahim College area"
    ],
    "Potiskum": [
      "Potiskum Town"
    ],
    "Nguru": [
      "Nguru Town"
    ]
  },

  "Borno": {
    "Maiduguri": [
      "Maiduguri Town", "GRA Maiduguri", "Gwange",
      "Bulumkutu", "Shehuri North", "Hausari",
      "Old Maiduguri Road"
    ],
    "Biu": [
      "Biu Town"
    ],
    "Konduga": [
      "Konduga Town"
    ]
  },

  "Adamawa": {
    "Yola": [
      "Yola Town", "GRA Yola", "Jimeta",
      "Doubeli", "Karewa", "Demsawo"
    ],
    "Mubi": [
      "Mubi Town", "Mubi North", "Maiha"
    ],
    "Numan": [
      "Numan Town"
    ]
  },

  "Taraba": {
    "Jalingo": [
      "Jalingo Town", "GRA Jalingo", "Baissa Road",
      "Turaki Layout"
    ],
    "Wukari": [
      "Wukari Town"
    ],
    "Bali": [
      "Bali Town"
    ]
  },

  "Bauchi": {
    "Bauchi City": [
      "Bauchi Town", "GRA Bauchi", "Yelwa",
      "Maiduguri Road Bauchi", "Dass Road"
    ],
    "Azare": [
      "Azare Town"
    ],
    "Misau": [
      "Misau Town"
    ]
  },

  "Gombe": {
    "Gombe City": [
      "Gombe Town", "GRA Gombe", "Tudun Wada Gombe",
      "Jekadafari", "Old Market Road"
    ],
    "Kaltungo": [
      "Kaltungo Town"
    ],
    "Billiri": [
      "Billiri Town"
    ]
  },

  "Ebonyi": {
    "Abakaliki": [
      "Abakaliki Town", "GRA Abakaliki", "Mile 50",
      "Waterworks Road", "Ogoja Road Abakaliki"
    ],
    "Afikpo": [
      "Afikpo Town", "Edda"
    ],
    "Onueke": [
      "Onueke Town"
    ]
  }
};