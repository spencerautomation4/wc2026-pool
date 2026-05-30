import React, { useState, useEffect, useRef, useMemo } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set, get } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCB9OlyhhuqYanWYsYGjb8mYWPlr1bNB1E",
  authDomain: "wc2026pool-4f54d.firebaseapp.com",
  databaseURL: "https://wc2026pool-4f54d-default-rtdb.firebaseio.com",
  projectId: "wc2026pool-4f54d",
  storageBucket: "wc2026pool-4f54d.firebasestorage.app",
  messagingSenderId: "250184560936",
  appId: "1:250184560936:web:603e12a995c1c9b733601d"
};
const firebaseApp = initializeApp(firebaseConfig);
const db = getDatabase(firebaseApp);

const GROUPS = {
  A:["Mexico","South Africa","South Korea","Czech Republic"],
  B:["Canada","Bosnia and Herzegovina","Qatar","Switzerland"],
  C:["Brazil","Morocco","Haiti","Scotland"],
  D:["United States","Paraguay","Australia","Turkey"],
  E:["Germany","Curaçao","Ivory Coast","Ecuador"],
  F:["Netherlands","Japan","Sweden","Tunisia"],
  G:["Belgium","Egypt","Iran","New Zealand"],
  H:["Spain","Cape Verde","Saudi Arabia","Uruguay"],
  I:["France","Senegal","Iraq","Norway"],
  J:["Argentina","Algeria","Austria","Jordan"],
  K:["Portugal","DR Congo","Uzbekistan","Colombia"],
  L:["England","Croatia","Ghana","Panama"],
};
const GROUP_IDS = Object.keys(GROUPS);
const PAIRS = [[0,1],[2,3],[0,2],[3,1],[3,0],[1,2]];
const FIFA = {"Spain":1,"Argentina":2,"France":3,"England":4,"Brazil":5,"Portugal":6,"Netherlands":7,"Belgium":8,"Germany":9,"Croatia":10,"Morocco":11,"Colombia":13,"United States":14,"Mexico":15,"Uruguay":16,"Switzerland":17,"Japan":18,"Senegal":19,"Iran":21,"South Korea":22,"Ecuador":23,"Turkey":25,"Australia":27,"Canada":27,"Norway":29,"Panama":30,"Egypt":34,"Algeria":35,"Scotland":36,"Ivory Coast":37,"Paraguay":39,"South Africa":40,"Sweden":42,"Czech Republic":43,"Tunisia":47,"DR Congo":48,"Saudi Arabia":50,"Iraq":54,"Bosnia and Herzegovina":55,"Qatar":60,"Jordan":66,"Cape Verde":68,"Ghana":72,"Curaçao":82,"Haiti":84,"New Zealand":85,"Uzbekistan":90};

const MATCH_INFO = {
  A:[[0,"Jun 11 · 3:00 PM · Mexico City"],[1,"Jun 11 · 10:00 PM · Guadalajara"],[2,"Jun 18 · 12:00 PM · Atlanta"],[3,"Jun 18 · 9:00 PM · Guadalajara"],[4,"Jun 24 · 9:00 PM · Mexico City"],[5,"Jun 24 · 9:00 PM · Monterrey"]],
  B:[[0,"Jun 12 · 3:00 PM · Toronto"],[1,"Jun 13 · 3:00 PM · San Francisco"],[2,"Jun 18 · 3:00 PM · Los Angeles"],[3,"Jun 18 · 6:00 PM · Vancouver"],[4,"Jun 24 · 3:00 PM · Vancouver"],[5,"Jun 24 · 3:00 PM · Seattle"]],
  C:[[0,"Jun 13 · 6:00 PM · New York/NJ"],[1,"Jun 13 · 9:00 PM · Boston"],[2,"Jun 19 · 6:00 PM · Boston"],[3,"Jun 19 · 9:00 PM · Philadelphia"],[4,"Jun 24 · 6:00 PM · Miami"],[5,"Jun 24 · 6:00 PM · Atlanta"]],
  D:[[0,"Jun 12 · 9:00 PM · Los Angeles"],[1,"Jun 13 · 12:00 AM · Vancouver"],[2,"Jun 19 · 3:00 PM · Seattle"],[3,"Jun 19 · 12:00 AM · San Francisco"],[4,"Jun 25 · 10:00 PM · Los Angeles"],[5,"Jun 25 · 10:00 PM · San Francisco"]],
  E:[[0,"Jun 14 · 1:00 PM · Houston"],[1,"Jun 14 · 7:00 PM · Philadelphia"],[2,"Jun 20 · 4:00 PM · Toronto"],[3,"Jun 20 · 8:00 PM · Kansas City"],[4,"Jun 25 · 4:00 PM · New York/NJ"],[5,"Jun 25 · 4:00 PM · Philadelphia"]],
  F:[[0,"Jun 14 · 4:00 PM · Dallas"],[1,"Jun 14 · 10:00 PM · Monterrey"],[2,"Jun 20 · 1:00 PM · Houston"],[3,"Jun 20 · 12:00 AM · Monterrey"],[4,"Jun 25 · 7:00 PM · Dallas"],[5,"Jun 25 · 7:00 PM · Kansas City"]],
  G:[[0,"Jun 15 · 9:00 PM · Los Angeles"],[1,"Jun 15 · 3:00 PM · Seattle"],[2,"Jun 21 · 3:00 PM · Los Angeles"],[3,"Jun 21 · 9:00 PM · Vancouver"],[4,"Jun 26 · 11:00 PM · Seattle"],[5,"Jun 26 · 11:00 PM · Vancouver"]],
  H:[[0,"Jun 15 · 12:00 PM · Atlanta"],[1,"Jun 15 · 6:00 PM · Miami"],[2,"Jun 21 · 12:00 PM · Atlanta"],[3,"Jun 21 · 6:00 PM · Miami"],[4,"Jun 26 · 8:00 PM · Houston"],[5,"Jun 26 · 8:00 PM · Guadalajara"]],
  I:[[0,"Jun 16 · 3:00 PM · New York/NJ"],[1,"Jun 16 · 6:00 PM · Boston"],[2,"Jun 22 · 5:00 PM · Philadelphia"],[3,"Jun 22 · 8:00 PM · New York/NJ"],[4,"Jun 26 · 3:00 PM · Boston"],[5,"Jun 26 · 3:00 PM · Toronto"]],
  J:[[0,"Jun 16 · 9:00 PM · Kansas City"],[1,"Jun 16 · 12:00 AM · San Francisco"],[2,"Jun 22 · 1:00 PM · Dallas"],[3,"Jun 22 · 11:00 PM · San Francisco"],[4,"Jun 27 · 10:00 PM · Kansas City"],[5,"Jun 27 · 10:00 PM · Dallas"]],
  K:[[0,"Jun 17 · 1:00 PM · Houston"],[1,"Jun 17 · 10:00 PM · Mexico City"],[2,"Jun 23 · 1:00 PM · Houston"],[3,"Jun 23 · 10:00 PM · Guadalajara"],[4,"Jun 27 · 7:30 PM · Miami"],[5,"Jun 27 · 7:30 PM · Atlanta"]],
  L:[[0,"Jun 17 · 4:00 PM · Dallas"],[1,"Jun 17 · 7:00 PM · Toronto"],[2,"Jun 23 · 4:00 PM · Boston"],[3,"Jun 23 · 7:00 PM · Toronto"],[4,"Jun 27 · 5:00 PM · New York/NJ"],[5,"Jun 27 · 5:00 PM · Philadelphia"]],
};

const TP = {
"EFGHIJKL":"EJIFHGLK","DFGHIJKL":"HGIDJFLK","DEGHIJKL":"EJIDHGLK","DEFHIJKL":"EJIDHFLK","DEFGIJKL":"EGIDJFLK","DEFGHJKL":"EGJDHFLK","DEFGHIKL":"EGIDHFLK","DEFGHIJL":"EGJDHFLI","DEFGHIJK":"EGJDHFIK",
"CFGHIJKL":"HGICJFLK","CEGHIJKL":"EJICHGLK","CEFHIJKL":"EJICHFLK","CEFGIJKL":"EGICJFLK","CEFGHJKL":"EGJCHFLK","CEFGHIKL":"EGICHFLK","CEFGHIJL":"EGJCHFLI","CEFGHIJK":"EGJCHFIK",
"CDGHIJKL":"HGICJDLK","CDFHIJKL":"CJIDHFLK","CDFGIJKL":"CGIDJFLK","CDFGHJKL":"CGJDHFLK","CDFGHIKL":"CGIDHFLK","CDFGHIJL":"CGJDHFLI","CDFGHIJK":"CGJDHFIK",
"CDEHIJKL":"EJICHDLK","CDEGIJKL":"EGICJDLK","CDEGHJKL":"EGJCHDLK","CDEGHIKL":"EGICHDLK","CDEGHIJL":"EGJCHDLI","CDEGHIJK":"EGJCHDIK",
"CDEFIJKL":"CJEDIFLK","CDEFHJKL":"CJEDHFLK","CDEFHIKL":"CEIDHFLK","CDEFHIJL":"CJEDHFLI","CDEFHIJK":"CJEDHFIK","CDEFGJKL":"CGEDJFLK","CDEFGIKL":"CGEDIFLK","CDEFGIJL":"CGEDJFLI","CDEFGIJK":"CGEDJFIK","CDEFGHKL":"CGEDHFLK","CDEFGHJL":"CGJDHFLE","CDEFGHJK":"CGJDHFEK","CDEFGHIL":"CGEDHFLI","CDEFGHIK":"CGEDHFIK","CDEFGHIJ":"CGJDHFEI",
"BFGHIJKL":"HJBFIGLK","BEGHIJKL":"EJIBHGLK","BEFHIJKL":"EJBFIHLK","BEFGIJKL":"EJBFIGLK","BEFGHJKL":"EJBFHGLK","BEFGHIKL":"EGBFIHLK","BEFGHIJL":"EJBFHGLI","BEFGHIJK":"EJBFHGIK",
"BDGHIJKL":"HJBDIGLK","BDFHIJKL":"HJBDIFLK","BDFGIJKL":"IGBDJFLK","BDFGHJKL":"HGBDJFLK","BDFGHIKL":"HGBDIFLK","BDFGHIJL":"HGBDJFLI","BDFGHIJK":"HGBDJFIK",
"BDEHIJKL":"EJBDIHLK","BDEGIJKL":"EJBDIGLK","BDEGHJKL":"EJBDHGLK","BDEGHIKL":"EGBDIHLK","BDEGHIJL":"EJBDHGLI","BDEGHIJK":"EJBDHGIK",
"BDEFIJKL":"EJBDIFLK","BDEFHJKL":"EJBDHFLK","BDEFHIKL":"EIBDHFLK","BDEFHIJL":"EJBDHFLI","BDEFHIJK":"EJBDHFIK","BDEFGJKL":"EGBDJFLK","BDEFGIKL":"EGBDIFLK","BDEFGIJL":"EGBDJFLI","BDEFGIJK":"EGBDJFIK","BDEFGHKL":"EGBDHFLK","BDEFGHJL":"HGBDJFLE","BDEFGHJK":"HGBDJFEK","BDEFGHIL":"EGBDHFLI","BDEFGHIK":"EGBDHFIK","BDEFGHIJ":"HGBDJFEI",
"BCGHIJKL":"HJBCIGLK","BCFHIJKL":"HJBCIFLK","BCFGIJKL":"IGBCJFLK","BCFGHJKL":"HGBCJFLK","BCFGHIKL":"HGBCIFLK","BCFGHIJL":"HGBCJFLI","BCFGHIJK":"HGBCJFIK",
"BCEHIJKL":"EJBCIHLK","BCEGIJKL":"EJBCIGLK","BCEGHJKL":"EJBCHGLK","BCEGHIKL":"EGBCIHLK","BCEGHIJL":"EJBCHGLI","BCEGHIJK":"EJBCHGIK",
"BCEFIJKL":"EJBCIFLK","BCEFHJKL":"EJBCHFLK","BCEFHIKL":"EIBCHFLK","BCEFHIJL":"EJBCHFLI","BCEFHIJK":"EJBCHFIK","BCEFGJKL":"EGBCJFLK","BCEFGIKL":"EGBCIFLK","BCEFGIJL":"EGBCJFLI","BCEFGIJK":"EGBCJFIK","BCEFGHKL":"EGBCHFLK","BCEFGHJL":"HGBCJFLE","BCEFGHJK":"HGBCJFEK","BCEFGHIL":"EGBCHFLI","BCEFGHIK":"EGBCHFIK","BCEFGHIJ":"HGBCJFEI",
"BCDHIJKL":"HJBCIDLK","BCDGIJKL":"IGBCJDLK","BCDGHJKL":"HGBCJDLK","BCDGHIKL":"HGBCIDLK","BCDGHIJL":"HGBCJDLI","BCDGHIJK":"HGBCJDIK",
"BCDFIJKL":"CJBDIFLK","BCDFHJKL":"CJBDHFLK","BCDFHIKL":"CIBDHFLK","BCDFHIJL":"CJBDHFLI","BCDFHIJK":"CJBDHFIK","BCDFGJKL":"CGBDJFLK","BCDFGIKL":"CGBDIFLK","BCDFGIJL":"CGBDJFLI","BCDFGIJK":"CGBDJFIK","BCDFGHKL":"CGBDHFLK","BCDFGHJL":"CGBDHFLJ","BCDFGHJK":"HGBCJFDK","BCDFGHIL":"CGBDHFLI","BCDFGHIK":"CGBDHFIK","BCDFGHIJ":"HGBCJFDI",
"BCDEIJKL":"EJBCIDLK","BCDEHJKL":"EJBCHDLK","BCDEHIKL":"EIBCHDLK","BCDEHIJL":"EJBCHDLI","BCDEHIJK":"EJBCHDIK","BCDEGJKL":"EGBCJDLK","BCDEGIKL":"EGBCIDLK","BCDEGIJL":"EGBCJDLI","BCDEGIJK":"EGBCJDIK","BCDEGHKL":"EGBCHDLK","BCDEGHJL":"HGBCJDLE","BCDEGHJK":"HGBCJDEK","BCDEGHIL":"EGBCHDLI","BCDEGHIK":"EGBCHDIK","BCDEGHIJ":"HGBCJDEI",
"BCDEFJKL":"CJBDEFLK","BCDEFIKL":"CEBDIFLK","BCDEFIJL":"CJBDEFLI","BCDEFIJK":"CJBDEFIK","BCDEFHKL":"CEBDHFLK","BCDEFHJL":"CJBDHFLE","BCDEFHJK":"CJBDHFEK","BCDEFHIL":"CEBDHFLI","BCDEFHIK":"CEBDHFIK","BCDEFHIJ":"CJBDHFEI","BCDEFGKL":"CGBDEFLK","BCDEFGJL":"CGBDJFLE","BCDEFGJK":"CGBDJFEK","BCDEFGIL":"CGBDEFLI","BCDEFGIK":"CGBDEFIK","BCDEFGIJ":"CGBDJFEI","BCDEFGHL":"CGBDHFLE","BCDEFGHK":"CGBDHFEK","BCDEFGHJ":"HGBCJFDE","BCDEFGHI":"CGBDHFEI",
"AFGHIJKL":"HJIFAGLK","AEGHIJKL":"EJIAHGLK","AEFHIJKL":"EJIFAHLK","AEFGIJKL":"EJIFAGLK","AEFGHJKL":"EGJFAHLK","AEFGHIKL":"EGIFAHLK","AEFGHIJL":"EGJFAHLI","AEFGHIJK":"EGJFAHIK",
"ADGHIJKL":"HJIADGLK","ADFHIJKL":"HJIADFLK","ADFGIJKL":"IGJDAFLK","ADFGHJKL":"HGJDAFLK","ADFGHIKL":"HGIDAFLK","ADFGHIJL":"HGJDAFLI","ADFGHIJK":"HGJDAFIK",
"ADEHIJKL":"EJIADHLK","ADEGIJKL":"EJIADGLK","ADEGHJKL":"EGJDAHLK","ADEGHIKL":"EGIDAHLK","ADEGHIJL":"EGJDAHLI","ADEGHIJK":"EGJDAHIK",
"ADEFIJKL":"EJIADFLK","ADEFHJKL":"HJEADFLK","ADEFHIKL":"HEIDAFLK","ADEFHIJL":"HJEDAFLI","ADEFHIJK":"HJEDAFIK","ADEFGJKL":"EGJDAFLK","ADEFGIKL":"EGIDAFLK","ADEFGIJL":"EGJDAFLI","ADEFGIJK":"EGJDAFIK","ADEFGHKL":"HGEADFLK","ADEFGHJL":"HGJDAFLE","ADEFGHJK":"HGJDAFEK","ADEFGHIL":"HGEADFLI","ADEFGHIK":"HGEADFIK","ADEFGHIJ":"HGJDAFEI",
"ACGHIJKL":"HJICAGLK","ACFHIJKL":"HJICAFLK","ACFGIJKL":"IGJCAFLK","ACFGHJKL":"HGJCAFLK","ACFGHIKL":"HGICAFLK","ACFGHIJL":"HGJCAFLI","ACFGHIJK":"HGJCAFIK",
"ACEHIJKL":"EJICAHLK","ACEGIJKL":"EJICAGLK","ACEGHJKL":"EGJCAHLK","ACEGHIKL":"EGICAHLK","ACEGHIJL":"EGJCAHLI","ACEGHIJK":"EGJCAHIK",
"ACEFIJKL":"EJICAFLK","ACEFHJKL":"HJECAFLK","ACEFHIKL":"HEICAFLK","ACEFHIJL":"HJECAFLI","ACEFHIJK":"HJECAFIK","ACEFGJKL":"EGJCAFLK","ACEFGIKL":"EGICAFLK","ACEFGIJL":"EGJCAFLI","ACEFGIJK":"EGJCAFIK","ACEFGHKL":"HGECAFLK","ACEFGHJL":"HGJCAFLE","ACEFGHJK":"HGJCAFEK","ACEFGHIL":"HGECAFLI","ACEFGHIK":"HGECAFIK","ACEFGHIJ":"HGJCAFEI",
"ACDHIJKL":"HJICADLK","ACDGIJKL":"IGJCADLK","ACDGHJKL":"HGJCADLK","ACDGHIKL":"HGICADLK","ACDGHIJL":"HGJCADLI","ACDGHIJK":"HGJCADIK",
"ACDFIJKL":"CJIADFLK","ACDFHJKL":"HJFCADLK","ACDFHIKL":"HFICADLK","ACDFHIJL":"HJFCADLI","ACDFHIJK":"HJFCADIK","ACDFGJKL":"CGJDAFLK","ACDFGIKL":"CGIDAFLK","ACDFGIJL":"CGJDAFLI","ACDFGIJK":"CGJDAFIK","ACDFGHKL":"HGFCADLK","ACDFGHJL":"CGJDAFLH","ACDFGHJK":"HGJCAFDK","ACDFGHIL":"HGFCADLI","ACDFGHIK":"HGFCADIK","ACDFGHIJ":"HGJCAFDI",
"ACDEIJKL":"EJICADLK","ACDEHJKL":"HJECADLK","ACDEHIKL":"HEICADLK","ACDEHIJL":"HJECADLI","ACDEHIJK":"HJECADIK","ACDEGJKL":"EGJCADLK","ACDEGIKL":"EGICADLK","ACDEGIJL":"EGJCADLI","ACDEGIJK":"EGJCADIK","ACDEGHKL":"HGECADLK","ACDEGHJL":"HGJCADLE","ACDEGHJK":"HGJCADEK","ACDEGHIL":"HGECADLI","ACDEGHIK":"HGECADIK","ACDEGHIJ":"HGJCADEI",
"ACDEFJKL":"CJEADFLK","ACDEFIKL":"CEIADFLK","ACDEFIJL":"CJEADFLI","ACDEFIJK":"CJEADFIK","ACDEFHKL":"HEFCADLK","ACDEFHJL":"HJFCADLE","ACDEFHJK":"HJECAFDK","ACDEFHIL":"HEFCADLI","ACDEFHIK":"HEFCADIK","ACDEFHIJ":"HJECAFDI","ACDEFGKL":"CGEADFLK","ACDEFGJL":"CGJDAFLE","ACDEFGJK":"CGJDAFEK","ACDEFGIL":"CGEADFLI","ACDEFGIK":"CGEADFIK","ACDEFGIJ":"CGJDAFEI","ACDEFGHL":"HGFCADLE","ACDEFGHK":"HGECAFDK","ACDEFGHJ":"HGJCAFDE","ACDEFGHI":"HGECAFDI",
"ABGHIJKL":"HJBAIGLK","ABFHIJKL":"HJBAIFLK","ABFGIJKL":"IJBFAGLK","ABFGHJKL":"HJBFAGLK","ABFGHIKL":"HGBAIFLK","ABFGHIJL":"HJBFAGLI","ABFGHIJK":"HJBFAGIK",
"ABEHIJKL":"EJBAIHLK","ABEGIJKL":"EJBAIGLK","ABEGHJKL":"EJBAHGLK","ABEGHIKL":"EGBAIHLK","ABEGHIJL":"EJBAHGLI","ABEGHIJK":"EJBAHGIK",
"ABEFIJKL":"EJBAIFLK","ABEFHJKL":"EJBFAHLK","ABEFHIKL":"EIBFAHLK","ABEFHIJL":"EJBFAHLI","ABEFHIJK":"EJBFAHIK","ABEFGJKL":"EJBFAGLK","ABEFGIKL":"EGBAIFLK","ABEFGIJL":"EJBFAGLI","ABEFGIJK":"EJBFAGIK","ABEFGHKL":"EGBFAHLK","ABEFGHJL":"HJBFAGLE","ABEFGHJK":"HJBFAGEK","ABEFGHIL":"EGBFAHLI","ABEFGHIK":"EGBFAHIK","ABEFGHIJ":"HJBFAGEI",
"ABDHIJKL":"IJBDAHLK","ABDGIJKL":"IJBDAGLK","ABDGHJKL":"HJBDAGLK","ABDGHIKL":"IGBDAHLK","ABDGHIJL":"HJBDAGLI","ABDGHIJK":"HJBDAGIK",
"ABDFIJKL":"IJBDAFLK","ABDFHJKL":"HJBDAFLK","ABDFHIKL":"HIBDAFLK","ABDFHIJL":"HJBDAFLI","ABDFHIJK":"HJBDAFIK","ABDFGJKL":"FJBDAGLK","ABDFGIKL":"IGBDAFLK","ABDFGIJL":"FJBDAGLI","ABDFGIJK":"FJBDAGIK","ABDFGHKL":"HGBDAFLK","ABDFGHJL":"HGBDAFLJ","ABDFGHJK":"HGBDAFJK","ABDFGHIL":"HGBDAFLI","ABDFGHIK":"HGBDAFIK","ABDFGHIJ":"HGBDAFIJ",
"ABDEIJKL":"EJBAIDLK","ABDEHJKL":"EJBDAHLK","ABDEHIKL":"EIBDAHLK","ABDEHIJL":"EJBDAHLI","ABDEHIJK":"EJBDAHIK","ABDEGJKL":"EJBDAGLK","ABDEGIKL":"EGBAIDLK","ABDEGIJL":"EJBDAGLI","ABDEGIJK":"EJBDAGIK","ABDEGHKL":"EGBDAHLK","ABDEGHJL":"HJBDAGLE","ABDEGHJK":"HJBDAGEK","ABDEGHIL":"EGBDAHLI","ABDEGHIK":"EGBDAHIK","ABDEGHIJ":"HJBDAGEI",
"ABDEFJKL":"EJBDAFLK","ABDEFIKL":"EIBDAFLK","ABDEFIJL":"EJBDAFLI","ABDEFIJK":"EJBDAFIK","ABDEFHKL":"HEBDAFLK","ABDEFHJL":"HJBDAFLE","ABDEFHJK":"HJBDAFEK","ABDEFHIL":"HEBDAFLI","ABDEFHIK":"HEBDAFIK","ABDEFHIJ":"HJBDAFEI","ABDEFGKL":"EGBDAFLK","ABDEFGJL":"EGBDAFLJ","ABDEFGJK":"EGBDAFJK","ABDEFGIL":"EGBDAFLI","ABDEFGIK":"EGBDAFIK","ABDEFGIJ":"EGBDAFIJ","ABDEFGHL":"HGBDAFLE","ABDEFGHK":"HGBDAFEK","ABDEFGHJ":"HGBDAFEJ","ABDEFGHI":"HGBDAFEI",
"ABCHIJKL":"IJBCAHLK","ABCGIJKL":"IJBCAGLK","ABCGHJKL":"HJBCAGLK","ABCGHIKL":"IGBCAHLK","ABCGHIJL":"HJBCAGLI","ABCGHIJK":"HJBCAGIK",
"ABCFIJKL":"IJBCAFLK","ABCFHJKL":"HJBCAFLK","ABCFHIKL":"HIBCAFLK","ABCFHIJL":"HJBCAFLI","ABCFHIJK":"HJBCAFIK","ABCFGJKL":"CJBFAGLK","ABCFGIKL":"IGBCAFLK","ABCFGIJL":"CJBFAGLI","ABCFGIJK":"CJBFAGIK","ABCFGHKL":"HGBCAFLK","ABCFGHJL":"HGBCAFLJ","ABCFGHJK":"HGBCAFJK","ABCFGHIL":"HGBCAFLI","ABCFGHIK":"HGBCAFIK","ABCFGHIJ":"HGBCAFIJ",
"ABCEIJKL":"EJBAICLK","ABCEHJKL":"EJBCAHLK","ABCEHIKL":"EIBCAHLK","ABCEHIJL":"EJBCAHLI","ABCEHIJK":"EJBCAHIK","ABCEGJKL":"EJBCAGLK","ABCEGIKL":"EGBAICLK","ABCEGIJL":"EJBCAGLI","ABCEGIJK":"EJBCAGIK","ABCEGHKL":"EGBCAHLK","ABCEGHJL":"HJBCAGLE","ABCEGHJK":"HJBCAGEK","ABCEGHIL":"EGBCAHLI","ABCEGHIK":"EGBCAHIK","ABCEGHIJ":"HJBCAGEI",
"ABCEFJKL":"EJBCAFLK","ABCEFIKL":"EIBCAFLK","ABCEFIJL":"EJBCAFLI","ABCEFIJK":"EJBCAFIK","ABCEFHKL":"HEBCAFLK","ABCEFHJL":"HJBCAFLE","ABCEFHJK":"HJBCAFEK","ABCEFHIL":"HEBCAFLI","ABCEFHIK":"HEBCAFIK","ABCEFHIJ":"HJBCAFEI","ABCEFGKL":"EGBCAFLK","ABCEFGJL":"EGBCAFLJ","ABCEFGJK":"EGBCAFJK","ABCEFGIL":"EGBCAFLI","ABCEFGIK":"EGBCAFIK","ABCEFGIJ":"EGBCAFIJ","ABCEFGHL":"HGBCAFLE","ABCEFGHK":"HGBCAFEK","ABCEFGHJ":"HGBCAFEJ","ABCEFGHI":"HGBCAFEI",
"ABCDIJKL":"IJBCADLK","ABCDHJKL":"HJBCADLK","ABCDHIKL":"HIBCADLK","ABCDHIJL":"HJBCADLI","ABCDHIJK":"HJBCADIK","ABCDGJKL":"CJBDAGLK","ABCDGIKL":"IGBCADLK","ABCDGIJL":"CJBDAGLI","ABCDGIJK":"CJBDAGIK","ABCDGHKL":"HGBCADLK","ABCDGHJL":"HGBCADLJ","ABCDGHJK":"HGBCADJK","ABCDGHIL":"HGBCADLI","ABCDGHIK":"HGBCADIK","ABCDGHIJ":"HGBCADIJ",
"ABCDFJKL":"CJBDAFLK","ABCDFIKL":"CIBDAFLK","ABCDFIJL":"CJBDAFLI","ABCDFIJK":"CJBDAFIK","ABCDFHKL":"HFBCADLK","ABCDFHJL":"CJBDAFLH","ABCDFHJK":"HJBCAFDK","ABCDFHIL":"HFBCADLI","ABCDFHIK":"HFBCADIK","ABCDFHIJ":"HJBCAFDI","ABCDFGKL":"CGBDAFLK","ABCDFGJL":"CGBDAFLJ","ABCDFGJK":"CGBDAFJK","ABCDFGIL":"CGBDAFLI","ABCDFGIK":"CGBDAFIK","ABCDFGIJ":"CGBDAFIJ","ABCDFGHL":"CGBDAFLH","ABCDFGHK":"HGBCAFDK","ABCDFGHJ":"HGBCAFDJ","ABCDFGHI":"HGBCAFDI",
"ABCDEJKL":"EJBCADLK","ABCDEIKL":"EIBCADLK","ABCDEIJL":"EJBCADLI","ABCDEIJK":"EJBCADIK","ABCDEHKL":"HEBCADLK","ABCDEHJL":"HJBCADLE","ABCDEHJK":"HJBCADEK","ABCDEHIL":"HEBCADLI","ABCDEHIK":"HEBCADIK","ABCDEHIJ":"HJBCADEI","ABCDEGKL":"EGBCADLK","ABCDEGJL":"EGBCADLJ","ABCDEGJK":"EGBCADJK","ABCDEGIL":"EGBCADLI","ABCDEGIK":"EGBCADIK","ABCDEGIJ":"EGBCADIJ","ABCDEGHL":"HGBCADLE","ABCDEGHK":"HGBCADEK","ABCDEGHJ":"HGBCADEJ","ABCDEGHI":"HGBCADEI",
"ABCDEFKL":"CEBDAFLK","ABCDEFJL":"CJBDAFLE","ABCDEFJK":"CJBDAFEK","ABCDEFIL":"CEBDAFLI","ABCDEFIK":"CEBDAFIK","ABCDEFIJ":"CJBDAFEI","ABCDEFHL":"HFBCADLE","ABCDEFHK":"HEBCAFDK","ABCDEFHJ":"HJBCAFDE","ABCDEFHI":"HEBCAFDI","ABCDEFGL":"CGBDAFLE","ABCDEFGK":"CGBDAFEK","ABCDEFGJ":"CGBDAFEJ","ABCDEFGI":"CGBDAFEI","ABCDEFGH":"HGBCAFDE",
};

const R32=[{id:73,a:{t:"RU",g:"A"},b:{t:"RU",g:"B"}},{id:74,a:{t:"W",g:"E"},b:{t:"3",s:"1E"}},{id:75,a:{t:"W",g:"F"},b:{t:"RU",g:"C"}},{id:76,a:{t:"W",g:"C"},b:{t:"RU",g:"F"}},{id:77,a:{t:"W",g:"I"},b:{t:"3",s:"1I"}},{id:78,a:{t:"RU",g:"E"},b:{t:"RU",g:"I"}},{id:79,a:{t:"W",g:"A"},b:{t:"3",s:"1A"}},{id:80,a:{t:"W",g:"L"},b:{t:"3",s:"1L"}},{id:81,a:{t:"W",g:"D"},b:{t:"3",s:"1D"}},{id:82,a:{t:"W",g:"G"},b:{t:"3",s:"1G"}},{id:83,a:{t:"RU",g:"K"},b:{t:"RU",g:"L"}},{id:84,a:{t:"W",g:"H"},b:{t:"RU",g:"J"}},{id:85,a:{t:"W",g:"B"},b:{t:"3",s:"1B"}},{id:86,a:{t:"W",g:"J"},b:{t:"RU",g:"H"}},{id:87,a:{t:"W",g:"K"},b:{t:"3",s:"1K"}},{id:88,a:{t:"RU",g:"D"},b:{t:"RU",g:"G"}}];
const R16=[{id:89,from:[74,77]},{id:90,from:[73,75]},{id:91,from:[76,78]},{id:92,from:[79,80]},{id:93,from:[83,84]},{id:94,from:[81,82]},{id:95,from:[86,88]},{id:96,from:[85,87]}];
const QF=[{id:97,from:[89,90]},{id:98,from:[93,94]},{id:99,from:[91,92]},{id:100,from:[95,96]}];
const SF=[{id:101,from:[97,98]},{id:102,from:[99,100]}];

const MATCH_SCHEDULE = {
  73:"Jun 28 · 3:00 PM · Los Angeles",
  74:"Jun 29 · 1:00 PM · Houston",
  75:"Jun 29 · 4:30 PM · Boston",
  76:"Jun 29 · 9:00 PM · Monterrey",
  77:"Jun 30 · 1:00 PM · Dallas",
  78:"Jun 30 · 5:00 PM · New York/NJ",
  79:"Jun 30 · 9:00 PM · Mexico City",
  80:"Jul 1 · 12:00 PM · Atlanta",
  81:"Jul 1 · 4:00 PM · Seattle",
  82:"Jul 1 · 8:00 PM · San Francisco",
  83:"Jul 2 · 3:00 PM · Los Angeles",
  84:"Jul 2 · 7:00 PM · Toronto",
  85:"Jul 2 · 11:00 PM · Vancouver",
  86:"Jul 3 · 2:00 PM · Dallas",
  87:"Jul 3 · 6:00 PM · Miami",
  88:"Jul 3 · 9:30 PM · Kansas City",
  89:"Jul 4 · 1:00 PM · Houston",
  90:"Jul 4 · 5:00 PM · Philadelphia",
  91:"Jul 5 · 4:00 PM · New York/NJ",
  92:"Jul 5 · 8:00 PM · Mexico City",
  93:"Jul 6 · 3:00 PM · Dallas",
  94:"Jul 6 · 8:00 PM · Seattle",
  95:"Jul 7 · 12:00 PM · Atlanta",
  96:"Jul 7 · 4:00 PM · Vancouver",
  97:"Jul 9 · 3:00 PM · Boston",
  98:"Jul 9 · 7:00 PM · Dallas",
  99:"Jul 10 · 3:00 PM · Miami",
  100:"Jul 11 · 3:00 PM · Los Angeles",
  101:"Jul 14 · 3:00 PM · Dallas",
  102:"Jul 15 · 3:00 PM · Atlanta",
  103:"Jul 18 · 3:00 PM · Miami",
  104:"Jul 19 · 3:00 PM · New York/NJ",
};

const DRAFT_TIERS = {
  12:["Curaçao","Haiti","South Africa","Uzbekistan"],
  11:["New Zealand","Panama","Qatar","Saudi Arabia"],
  10:["Cape Verde","DR Congo","Iraq","Jordan"],
  9:["Australia","Iran","South Korea","Tunisia"],
  8:["Bosnia and Herzegovina","Egypt","Ghana","Scotland"],
  7:["Algeria","Czech Republic","Ivory Coast","Paraguay"],
  6:["Austria","Canada","Switzerland","Turkey"],
  5:["Ecuador","Mexico","Senegal","Sweden"],
  4:["Croatia","Japan","United States","Uruguay"],
  3:["Belgium","Colombia","Morocco","Norway"],
  2:["Brazil","Germany","Netherlands","Portugal"],
  1:["Argentina","England","France","Spain"],
};


DRAFT_TIERS[3] = ["Japan","Norway","United States","Uruguay"];

const DRAFT_ORDER = [12,11,10,9,8,7,6,5,4,3,2,1];
const OWNERS = ["Scott","Spencer","Grant","Andrew"];
const OWNER_COLORS = ["#2563EB","#16A34A","#D97706","#DC2626"];
const DOUBLE_PT_TIERS = new Set([9,10,11,12]);

// ─── SCORING ENGINE ──────────────────────────────────────────────────────────
// Returns {total, base, multiplier, breakdown:{goals,groupPts,position,positionLabel}}
function computeTeamScore(teamName, allSt, thirds, top8groups, gScores) {
  // Find which group this team is in
  let gid = null;
  for (const g of GROUP_IDS) {
    if (GROUPS[g].includes(teamName)) { gid = g; break; }
  }
  if (!gid) return { total:0, base:0, multiplier:1, breakdown:{goals:0,groupPts:0,position:0,positionLabel:""} };

  const standings = allSt[gid] || [];
  const teamSt = standings.find(t => t.name === teamName);
  if (!teamSt) return { total:0, base:0, multiplier:1, breakdown:{goals:0,groupPts:0,position:0,positionLabel:""} };

  // 1. Goals scored
  const goals = teamSt.gf;

  // 2. Group stage points earned
  const groupPts = teamSt.pts;

  // 3. Position bonus
  const rank = standings.findIndex(t => t.name === teamName); // 0-indexed
  let positionBonus = 0, positionLabel = "";
  const allGamesPlayed = teamSt.pld === 3;

  if (allGamesPlayed) {
    if (rank === 0) { positionBonus = 3; positionLabel = "Group winner"; }
    else if (rank === 1) { positionBonus = 2; positionLabel = "Group runner-up"; }
    else if (rank === 2 && top8groups.includes(gid)) {
      // Check if this specific team is one of the best thirds
      const thisThirdRank = thirds.findIndex(t => t.name === teamName);
      if (thisThirdRank >= 0 && thisThirdRank < 8) {
        positionBonus = 1; positionLabel = "Best 3rd (advances)";
      }
    }
  }

  const base = goals + groupPts + positionBonus;
  return {
    total: base,
    base,
    breakdown: { goals, groupPts, position: positionBonus, positionLabel },
  };
}

function computeStandings(gid,scores){
  const teams=GROUPS[gid];
  const s=teams.map(n=>({name:n,pts:0,w:0,d:0,l:0,gf:0,ga:0,gd:0,pld:0}));
  for(let m=0;m<6;m++){
    const key=`${gid}${m}`;const sc=scores[key];
    if(!sc||sc.h===""||sc.a===""||sc.h==null||sc.a==null)continue;
    const h=parseInt(sc.h),a=parseInt(sc.a);
    if(isNaN(h)||isNaN(a))continue;
    const[hi,ai]=PAIRS[m];
    s[hi].pld++;s[hi].gf+=h;s[hi].ga+=a;s[hi].gd+=h-a;
    s[ai].pld++;s[ai].gf+=a;s[ai].ga+=h;s[ai].gd+=a-h;
    if(h>a){s[hi].pts+=3;s[hi].w++;s[ai].l++;}
    else if(h<a){s[ai].pts+=3;s[ai].w++;s[hi].l++;}
    else{s[hi].pts++;s[hi].d++;s[ai].pts++;s[ai].d++;}
  }
  return s.sort((a,b)=>b.pts-a.pts||b.gd-a.gd||b.gf-a.gf||(FIFA[a.name]||999)-(FIFA[b.name]||999));
}
function rankThirds(allSt){return GROUP_IDS.map(g=>({...allSt[g][2],group:g})).sort((a,b)=>b.pts-a.pts||b.gd-a.gd||b.gf-a.gf||(FIFA[a.name]||999)-(FIFA[b.name]||999));}
function getThirdAlloc(qualGroups){const key=[...qualGroups].sort().join("");const val=TP[key];if(!val)return null;const slots=["1A","1B","1D","1E","1G","1I","1K","1L"];const m={};slots.forEach((s,i)=>m[s]=val[i]);return m;}
function resolveTeam(slot,allSt,thirdAlloc){if(!slot)return null;if(slot.t==="W")return allSt[slot.g]?.[0]?.name;if(slot.t==="RU")return allSt[slot.g]?.[1]?.name;if(slot.t==="3"){const g=thirdAlloc?.[slot.s];return g?allSt[g]?.[2]?.name:null;}return null;}
function getMatchWinner(res,teamA,teamB){if(!res||res.ha===""||res.ha==null)return null;const ha=parseInt(res.ha),hb=parseInt(res.hb);if(isNaN(ha)||isNaN(hb))return null;if(ha>hb)return teamA;if(hb>ha)return teamB;if(res.pen==="A")return teamA;if(res.pen==="B")return teamB;return null;}

// ─── APP ─────────────────────────────────────────────────────────────────────
const DRAFT_INIT = {assignments:{},tierIdx:0,phase:"idle",leaderboardPublished:false};

// Error boundary so a broken tab never crashes the whole app
class TabBoundary extends React.Component {
  constructor(p){ super(p); this.state={error:null}; }
  static getDerivedStateFromError(e){ return {error:e}; }
  render(){
    if(this.state.error){
      return(
        <div style={{padding:40,textAlign:"center"}}>
          <div style={{fontSize:20,marginBottom:12}}>⚠️</div>
          <div style={{fontWeight:600,color:"#1A1A2E",marginBottom:8}}>Something went wrong on this tab</div>
          <div style={{fontSize:13,color:"#8896A4",marginBottom:20}}>{String(this.state.error)}</div>
          <button onClick={()=>this.setState({error:null})}
            style={{padding:"8px 20px",background:"#E8002D",color:"#fff",border:"none",borderRadius:6,cursor:"pointer",fontSize:13}}>
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Sanitize data coming from Firebase — null fields, missing keys, wrong types
function sanitizeDraft(d) {
  if(!d || typeof d !== "object") return null;
  return {
    assignments: (d.assignments && typeof d.assignments === "object") ? d.assignments : {},
    tierIdx: typeof d.tierIdx === "number" ? d.tierIdx : 0,
    phase: typeof d.phase === "string" ? d.phase : "idle",
    leaderboardPublished: !!d.leaderboardPublished,
  };
}

export default function App() {
  const [tab, setTab] = useState("groups");
  const [gScores, setGScores] = useState({});
  const [kRes, setKRes] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [draftState, setDraftState] = useState(null);
  const focusedRef = useRef(false);
  const localWriteRef = useRef(false); // true while we are writing to Firebase
  const draftPhaseRef = useRef("idle");
  const draftSavingRef = useRef(false);

  // Track focus so we don't overwrite a score the user is actively editing
  useEffect(()=>{
    const onFocus=()=>{focusedRef.current=true;};
    const onBlur=()=>{focusedRef.current=false;};
    document.addEventListener("focusin",onFocus);
    document.addEventListener("focusout",onBlur);
    return()=>{document.removeEventListener("focusin",onFocus);document.removeEventListener("focusout",onBlur);};
  },[]);

  // ── Game scores: subscribe to Firebase real-time updates ──────────────────
  useEffect(()=>{
    const scoresRef = ref(db, "wc26");
    const unsub = onValue(scoresRef, (snap)=>{
      if(focusedRef.current) return;      // user is typing — skip
      if(localWriteRef.current) return;   // we just wrote — skip echo
      const d = snap.val();
      if(d){
        setGScores(d.g || {});
        setKRes(d.k || {});
      }
      setLoaded(true);
    });
    return ()=>unsub();
  },[]);

  // Write game scores to Firebase (debounced 800ms)
  useEffect(()=>{
    if(!loaded) return;
    const t = setTimeout(async()=>{
      localWriteRef.current = true;
      try{ await set(ref(db,"wc26"), {g:gScores, k:kRes}); }catch(e){}
      // Release echo-block after a brief delay so our own listener skips this write
      setTimeout(()=>{ localWriteRef.current=false; }, 500);
    }, 800);
    return()=>clearTimeout(t);
  },[gScores, kRes, loaded]);

  // ── Draft state: subscribe to Firebase real-time updates ─────────────────
  useEffect(()=>{ draftPhaseRef.current = draftState?.phase ?? "idle"; },[draftState]);

  useEffect(()=>{
    const draftRef = ref(db, "wc26draft");
    const unsub = onValue(draftRef, (snap)=>{
      if(draftSavingRef.current) return;
      const phase = draftPhaseRef.current;
      if(phase === "shuffling" || phase === "revealing") return;
      const d = snap.val();
      setDraftState(prev => sanitizeDraft(d) ?? prev ?? DRAFT_INIT);
    });
    return ()=>unsub();
  },[]);

  async function saveDraft(s){
    draftSavingRef.current = true;
    try{ await set(ref(db,"wc26draft"), s); }catch(e){}
    draftSavingRef.current = false;
  }

  const allSt=useMemo(()=>{const r={};GROUP_IDS.forEach(g=>r[g]=computeStandings(g,gScores));return r;},[gScores]);
  const thirds=useMemo(()=>rankThirds(allSt),[allSt]);
  const top8groups=useMemo(()=>thirds.slice(0,8).map(t=>t.group).sort(),[thirds]);
  const thirdAlloc=useMemo(()=>getThirdAlloc(top8groups),[top8groups]);

  const bracketTeams=useMemo(()=>{
    const bt={};
    R32.forEach(m=>{bt[m.id]={A:resolveTeam(m.a,allSt,thirdAlloc),B:resolveTeam(m.b,allSt,thirdAlloc)};});
    [...R16,...QF,...SF].forEach(m=>{
      const wA=getMatchWinner(kRes[m.from[0]],bt[m.from[0]]?.A,bt[m.from[0]]?.B);
      const wB=getMatchWinner(kRes[m.from[1]],bt[m.from[1]]?.A,bt[m.from[1]]?.B);
      bt[m.id]={A:wA,B:wB};
    });
    const lA=getMatchWinner(kRes[101],bt[101]?.A,bt[101]?.B);
    const lB=getMatchWinner(kRes[102],bt[102]?.A,bt[102]?.B);
    bt[104]={A:lA,B:lB};
    bt[103]={A:lA?(bt[101]?.A===lA?bt[101]?.B:bt[101]?.A):null,B:lB?(bt[102]?.A===lB?bt[102]?.B:bt[102]?.A):null};
    return bt;
  },[allSt,thirdAlloc,kRes]);

  const setGroupScore=(gid,mi,side,val)=>{const k=`${gid}${mi}`;setGScores(p=>({...p,[k]:{...(p[k]||{}),h:side==="h"?val:(p[k]?.h??""),a:side==="a"?val:(p[k]?.a??"")}}));};
  const setKnockout=(mid,field,val)=>setKRes(p=>({...p,[mid]:{...(p[mid]||{}),[field]:val}}));

  const leaderboardPublished = draftState?.leaderboardPublished && draftState?.phase==="done";
  const tabs = ["groups","bracket","draft", ...(leaderboardPublished?["leaderboard"]:[])];

  return (
    <div style={{minHeight:"100vh",background:"#F7F8FA",color:"#1A1A2E",fontFamily:"'DM Sans','Segoe UI',system-ui,sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Barlow+Condensed:wght@600;700&display=swap');
        *{box-sizing:border-box;}
        .tab-btn{padding:9px 22px;border-radius:6px;font-size:13px;font-weight:600;letter-spacing:.04em;cursor:pointer;border:none;transition:all .15s;font-family:inherit;}
        .tab-active{background:#E8002D;color:#fff;}
        .tab-inactive{background:#fff;color:#4A5568;border:1.5px solid #E2E8F0;}
        .tab-inactive:hover{border-color:#E8002D;color:#E8002D;}
        .score-inp{width:38px;height:34px;background:#fff;border:1.5px solid #CBD5E0;color:#1A1A2E;text-align:center;border-radius:6px;font-size:15px;font-weight:600;outline:none;font-family:inherit;transition:border-color .12s;}
        .score-inp:focus{border-color:#E8002D;box-shadow:0 0 0 3px rgba(232,0,45,.1);}
        .score-inp::placeholder{color:#CBD5E0;}
        .score-inp:disabled{background:#F7F8FA;border-color:#E2E8F0;cursor:not-allowed;}
        .pen-sel{background:#fff;border:1.5px solid #CBD5E0;color:#1A1A2E;border-radius:6px;padding:3px 6px;font-size:12px;outline:none;font-family:inherit;}
        .pen-sel:focus{border-color:#E8002D;}
        .bk-score{width:28px;height:26px;background:#fff;border:1.5px solid #CBD5E0;color:#1A1A2E;text-align:center;border-radius:5px;font-size:13px;font-weight:600;outline:none;padding:0;font-family:inherit;}
        .bk-score:focus{border-color:#E8002D;box-shadow:0 0 0 2px rgba(232,0,45,.1);}
        .bk-score:disabled{background:#F7F8FA;border-color:#E2E8F0;cursor:not-allowed;}
        .card{background:#fff;border:1.5px solid #E2E8F0;border-radius:12px;overflow:hidden;}
        .st-row{transition:background .1s;}
        .st-row:hover{background:#FFF5F7;}
        @keyframes slideIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
        .reveal-in{animation:slideIn .35s ease forwards;}
        .shuffling{animation:pulse .5s ease infinite;}
        .lb-row{transition:background .12s;cursor:pointer;}
        .lb-row:hover{background:#FFF5F7;}
        .team-row-expand{animation:slideIn .2s ease forwards;}
        .draft-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:20px;}
        @media(max-width:700px){.draft-grid{grid-template-columns:repeat(2,1fr);}}
      `}</style>

      <div style={{background:"#E8002D",padding:"8px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",minHeight:56,flexWrap:"wrap",gap:8}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,color:"#fff",fontWeight:700,letterSpacing:".06em"}}>FIFA WORLD CUP 2026</span>
          <span style={{background:"rgba(255,255,255,.2)",color:"#fff",fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:4,letterSpacing:".1em"}}>POOL TRACKER</span>
        </div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {tabs.map(t=>(
            <button key={t} className={`tab-btn ${tab===t?"tab-active":"tab-inactive"}`}
              style={tab===t?{background:"#fff",color:"#E8002D"}:{}}
              onClick={()=>setTab(t)}>
              {t==="groups"?"GROUP STAGE":t==="bracket"?"BRACKET":t==="draft"?"DRAFT":"LEADERBOARD"}
            </button>
          ))}
        </div>
      </div>

      <TabBoundary key={tab}>
        {tab==="groups" && <GroupsTab allSt={allSt} gScores={gScores} setGroupScore={setGroupScore} thirds={thirds}/>}
        {tab==="bracket" && <BracketTab bracketTeams={bracketTeams} kRes={kRes} setKnockout={setKnockout}/>}
        {tab==="draft" && <DraftTab draftState={draftState} setDraftState={setDraftState} saveDraft={saveDraft} setTab={setTab}/>}
        {tab==="leaderboard" && <LeaderboardTab draftState={draftState} allSt={allSt} thirds={thirds} top8groups={top8groups} gScores={gScores}/>}
      </TabBoundary>
    </div>
  );
}

// ─── GROUP STAGE ─────────────────────────────────────────────────────────────
function GroupsTab({allSt,gScores,setGroupScore,thirds}){
  const qualSet=new Set(thirds.slice(0,8).map(t=>t.name));
  return(
    <div style={{padding:"20px 24px"}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(360px,1fr))",gap:16}}>
        {GROUP_IDS.map(g=><GroupCard key={g} gid={g} st={allSt[g]} gScores={gScores} setGroupScore={setGroupScore} qualSet={qualSet}/>)}
      </div>
      <ThirdsPanel thirds={thirds}/>
    </div>
  );
}

function GroupCard({gid,st,gScores,setGroupScore,qualSet}){
  const teams=GROUPS[gid];
  const infos=MATCH_INFO[gid];
  return(
    <div className="card">
      <div style={{padding:"10px 16px",borderBottom:"1.5px solid #E2E8F0"}}>
        <div style={{background:"#E8002D",color:"#fff",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:18,letterSpacing:".08em",padding:"2px 10px",borderRadius:5,display:"inline-block"}}>GROUP {gid}</div>
      </div>
      <div style={{padding:"12px 16px",borderBottom:"1.5px solid #E2E8F0"}}>
        {[0,1,2,3,4,5].map(mi=>{
          const[hi,ai]=PAIRS[mi];
          const sc=gScores[`${gid}${mi}`]||{};
          const info=infos.find(x=>x[0]===mi);
          const entered=sc.h!==""&&sc.h!=null&&sc.a!==""&&sc.a!=null&&!isNaN(parseInt(sc.h))&&!isNaN(parseInt(sc.a));
          const homeWon=entered&&parseInt(sc.h)>parseInt(sc.a);
          const awayWon=entered&&parseInt(sc.a)>parseInt(sc.h);
          return(
            <div key={mi} style={{marginBottom:mi<5?10:0}}>
              <div style={{fontSize:11,color:"#8896A4",marginBottom:4,fontWeight:500}}>{info?info[1]:""}</div>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{flex:1,fontSize:13,fontWeight:600,textAlign:"right",color:homeWon?"#1A1A2E":awayWon?"#8896A4":"#1A1A2E",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{teams[hi]}</span>
                <div style={{display:"flex",alignItems:"center",gap:4}}>
                  <input className="score-inp" placeholder="—" value={sc.h??""} onChange={e=>setGroupScore(gid,mi,"h",e.target.value)}/>
                  <span style={{color:"#CBD5E0",fontSize:13,fontWeight:600,userSelect:"none"}}>–</span>
                  <input className="score-inp" placeholder="—" value={sc.a??""} onChange={e=>setGroupScore(gid,mi,"a",e.target.value)}/>
                </div>
                <span style={{flex:1,fontSize:13,fontWeight:600,color:awayWon?"#1A1A2E":homeWon?"#8896A4":"#1A1A2E",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{teams[ai]}</span>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{padding:"10px 16px 14px"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead>
            <tr style={{color:"#8896A4",fontSize:10,fontWeight:600,letterSpacing:".06em",textTransform:"uppercase"}}>
              <th style={{textAlign:"left",paddingBottom:6,width:22}}>#</th>
              <th style={{textAlign:"left",paddingBottom:6}}>Team</th>
              <th style={{textAlign:"center",paddingBottom:6,width:26}}>P</th>
              <th style={{textAlign:"center",paddingBottom:6,width:26}}>W</th>
              <th style={{textAlign:"center",paddingBottom:6,width:26}}>D</th>
              <th style={{textAlign:"center",paddingBottom:6,width:26}}>L</th>
              <th style={{textAlign:"center",paddingBottom:6,width:32}}>GD</th>
              <th style={{textAlign:"center",paddingBottom:6,width:32}}>GF</th>
              <th style={{textAlign:"center",paddingBottom:6,width:34,color:"#E8002D"}}>Pts</th>
            </tr>
          </thead>
          <tbody>
            {st.map((t,i)=>{
              const isFirst=i===0,isSecond=i===1,isThird=qualSet.has(t.name);
              const lbc=isFirst?"#E8002D":isSecond?"#4A5568":isThird?"#0072CE":"transparent";
              return(
                <tr key={t.name} className="st-row" style={{borderLeft:`3px solid ${lbc}`}}>
                  <td style={{padding:"5px 0 5px 6px",color:isFirst?"#E8002D":isSecond?"#4A5568":"#8896A4",fontWeight:700,fontSize:11}}>{i+1}</td>
                  <td style={{padding:"5px 0",color:i<2?"#1A1A2E":isThird?"#2D3748":"#8896A4",fontWeight:i<2?600:400,maxWidth:130,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.name}</td>
                  <td style={{textAlign:"center",padding:"5px 0",color:"#4A5568"}}>{t.pld}</td>
                  <td style={{textAlign:"center",padding:"5px 0",color:"#4A5568"}}>{t.w}</td>
                  <td style={{textAlign:"center",padding:"5px 0",color:"#4A5568"}}>{t.d}</td>
                  <td style={{textAlign:"center",padding:"5px 0",color:"#4A5568"}}>{t.l}</td>
                  <td style={{textAlign:"center",padding:"5px 0",color:t.gd>0?"#2F855A":t.gd<0?"#C53030":"#4A5568",fontWeight:t.gd!==0?600:400}}>{t.gd>0?"+":""}{t.gd}</td>
                  <td style={{textAlign:"center",padding:"5px 0",color:"#4A5568"}}>{t.gf}</td>
                  <td style={{textAlign:"center",padding:"5px 0",fontWeight:700,color:"#E8002D",fontSize:13}}>{t.pts}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div style={{display:"flex",gap:14,marginTop:8,flexWrap:"wrap"}}>
          <span style={{fontSize:10,color:"#E8002D",display:"flex",alignItems:"center",gap:4}}><span style={{width:3,height:12,background:"#E8002D",borderRadius:2,display:"inline-block"}}/>Advances (1st)</span>
          <span style={{fontSize:10,color:"#4A5568",display:"flex",alignItems:"center",gap:4}}><span style={{width:3,height:12,background:"#4A5568",borderRadius:2,display:"inline-block"}}/>Advances (2nd)</span>
          <span style={{fontSize:10,color:"#0072CE",display:"flex",alignItems:"center",gap:4}}><span style={{width:3,height:12,background:"#0072CE",borderRadius:2,display:"inline-block"}}/>Possible best 3rd</span>
        </div>
      </div>
    </div>
  );
}

function ThirdsPanel({thirds}){
  return(
    <div className="card" style={{marginTop:20}}>
      <div style={{padding:"10px 16px",borderBottom:"1.5px solid #E2E8F0",display:"flex",alignItems:"center",gap:10}}>
        <div style={{background:"#0072CE",color:"#fff",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:15,letterSpacing:".06em",padding:"2px 10px",borderRadius:5}}>BEST THIRD-PLACE RANKING</div>
        <span style={{fontSize:11,color:"#8896A4"}}>Top 8 advance to Round of 32</span>
      </div>
      <div style={{padding:"12px 16px"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(195px,1fr))",gap:8}}>
          {thirds.map((t,i)=>(
            <div key={t.name} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 12px",borderRadius:8,background:i<8?"#EBF8FF":"#F7F8FA",border:`1.5px solid ${i<8?"#BEE3F8":"#E2E8F0"}`}}>
              <span style={{fontSize:13,fontWeight:700,color:i<8?"#0072CE":"#8896A4",minWidth:18}}>{i+1}</span>
              <span style={{fontSize:11,color:"#8896A4",minWidth:14,textAlign:"center",fontWeight:600}}>{t.group}</span>
              <span style={{fontSize:12,flex:1,color:i<8?"#1A1A2E":"#8896A4",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",fontWeight:i<8?500:400}}>{t.name}</span>
              <span style={{fontSize:11,fontWeight:700,color:"#E8002D"}}>{t.pts}</span>
              <span style={{fontSize:10,color:t.gd>0?"#2F855A":t.gd<0?"#C53030":"#8896A4",fontWeight:600}}>{t.gd>0?"+":""}{t.gd}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── BRACKET ─────────────────────────────────────────────────────────────────
function BracketTab({bracketTeams,kRes,setKnockout}){
  return(<div style={{padding:"20px 24px",overflowX:"auto"}}><VisualBracket bracketTeams={bracketTeams} kRes={kRes} setKnockout={setKnockout}/></div>);
}
function BKMatch({mid,bracketTeams,kRes,setKnockout,isFinal,is3rd}){
  const teams=bracketTeams[mid]||{};
  const res=kRes[mid]||{};
  const ha=res.ha??"",hb=res.hb??"";
  const tied=ha!==""&&hb!==""&&!isNaN(parseInt(ha))&&parseInt(ha)===parseInt(hb);
  const winner=getMatchWinner(res,teams.A,teams.B);
  const sched=MATCH_SCHEDULE[mid]||"";
  const labelColor=isFinal?"#E8002D":is3rd?"#B7791F":"#8896A4";
  return(
    <div style={{background:"#fff",border:`1.5px solid ${isFinal?"#E8002D":is3rd?"#D69E2E":"#E2E8F0"}`,borderRadius:8,padding:"7px 10px 8px",minWidth:184,width:184,boxShadow:isFinal?"0 2px 8px rgba(232,0,45,.12)":"none"}}>
      <div style={{fontSize:10,color:labelColor,fontWeight:500,marginBottom:5,letterSpacing:".01em",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{sched}</div>
      <div style={{display:"flex",alignItems:"center",gap:6,minHeight:26}}>
        <span style={{flex:1,fontSize:12,fontWeight:winner===teams.A?700:500,color:teams.A?winner===teams.A?"#1A1A2E":winner&&winner!==teams.A?"#A0AEC0":"#1A1A2E":"#CBD5E0",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",fontStyle:teams.A?"normal":"italic"}}>{teams.A||"TBD"}</span>
        <input className="bk-score" placeholder="—" value={ha} onChange={e=>setKnockout(mid,"ha",e.target.value)} disabled={!teams.A}/>
      </div>
      <div style={{height:1,background:"#F0F2F5",margin:"4px 0"}}/>
      <div style={{display:"flex",alignItems:"center",gap:6,minHeight:26}}>
        <span style={{flex:1,fontSize:12,fontWeight:winner===teams.B?700:500,color:teams.B?winner===teams.B?"#1A1A2E":winner&&winner!==teams.B?"#A0AEC0":"#1A1A2E":"#CBD5E0",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",fontStyle:teams.B?"normal":"italic"}}>{teams.B||"TBD"}</span>
        <input className="bk-score" placeholder="—" value={hb} onChange={e=>setKnockout(mid,"hb",e.target.value)} disabled={!teams.B}/>
      </div>
      {tied&&(<div style={{marginTop:5,paddingTop:5,borderTop:"1px solid #F0F2F5",display:"flex",alignItems:"center",gap:5}}><span style={{fontSize:10,color:"#8896A4",fontWeight:500}}>Pen:</span><select className="pen-sel" value={res.pen||""} onChange={e=>setKnockout(mid,"pen",e.target.value)}><option value="">—</option><option value="A">{(teams.A||"A").substring(0,12)}</option><option value="B">{(teams.B||"B").substring(0,12)}</option></select></div>)}
    </div>
  );
}
function ColLabel({c}){return <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,fontWeight:700,color:"#8896A4",letterSpacing:".1em",marginBottom:10,textAlign:"center",textTransform:"uppercase"}}>{c}</div>;}
function Sp({h}){return <div style={{flexShrink:0,height:h}}/>;}
function BKCol({label,children,w}){return(<div style={{display:"flex",flexDirection:"column",minWidth:w||190,width:w||190}}><ColLabel c={label}/><div style={{display:"flex",flexDirection:"column",flex:1}}>{children}</div></div>);}
const GAP=10,MH=84;
function VisualBracket({bracketTeams,kRes,setKnockout}){
  const M=(id,o={})=><BKMatch key={id} mid={id} bracketTeams={bracketTeams} kRes={kRes} setKnockout={setKnockout} isFinal={o.final} is3rd={o.third}/>;
  return(
    <div>
      <div style={{fontSize:11,color:"#8896A4",marginBottom:14}}>Enter scores in any match box · tied knockout scores reveal a penalty picker · scroll right on narrow screens</div>
      <div style={{display:"flex",gap:16,alignItems:"flex-start"}}>
        <BKCol label="Round of 32" w={192}>{M(74)}<Sp h={GAP}/>{M(77)}<Sp h={16}/>{M(76)}<Sp h={GAP}/>{M(78)}<Sp h={16}/>{M(79)}<Sp h={GAP}/>{M(80)}<Sp h={16}/>{M(81)}<Sp h={GAP}/>{M(82)}</BKCol>
        <BKCol label="Round of 16" w={192}><Sp h={47}/>{M(89)}<Sp h={110}/>{M(91)}<Sp h={110}/>{M(92)}<Sp h={110}/>{M(94)}</BKCol>
        <BKCol label="Quarterfinals" w={192}><Sp h={144}/>{M(97)}<Sp h={304}/>{M(99)}</BKCol>
        <BKCol label="Semifinals" w={192}><Sp h={338}/>{M(101)}</BKCol>
        <BKCol label="Final" w={192}><Sp h={338}/>{M(104,{final:true})}<Sp h={20}/>{M(103,{third:true})}</BKCol>
        <BKCol label="Semifinals" w={192}><Sp h={338}/>{M(102)}</BKCol>
        <BKCol label="Quarterfinals" w={192}><Sp h={144}/>{M(98)}<Sp h={304}/>{M(100)}</BKCol>
        <BKCol label="Round of 16" w={192}><Sp h={47}/>{M(90)}<Sp h={110}/>{M(93)}<Sp h={110}/>{M(95)}<Sp h={110}/>{M(96)}</BKCol>
        <BKCol label="Round of 32" w={192}>{M(75)}<Sp h={GAP}/>{M(73)}<Sp h={16}/>{M(83)}<Sp h={GAP}/>{M(84)}<Sp h={16}/>{M(86)}<Sp h={GAP}/>{M(88)}<Sp h={16}/>{M(85)}<Sp h={GAP}/>{M(87)}</BKCol>
      </div>
      <div style={{marginTop:20,padding:"10px 14px",background:"#fff",border:"1.5px solid #E2E8F0",borderRadius:8,fontSize:11,color:"#4A5568"}}><strong style={{color:"#1A1A2E"}}>Bold name</strong> = match winner · <span style={{color:"#A0AEC0"}}>Faded</span> = eliminated · <span style={{color:"#E8002D"}}>Red border</span> = Final</div>
    </div>
  );
}

// ─── DRAFT TAB ────────────────────────────────────────────────────────────────
function DraftTab({draftState, setDraftState, saveDraft, setTab}) {
  const [shuffleTeams, setShuffleTeams] = useState([]);
  const [revealedCount, setRevealedCount] = useState(0);

  // Refs hold the canonical mutable values — never stale in callbacks
  const pendingRef = useRef([]);          // [{owner, team}] for current tier
  const revealedRef = useRef(0);          // mirrors revealedCount state
  const shuffleTimerRef = useRef(null);
  const revealTimerRef = useRef(null);
  const draftStateRef = useRef(draftState);

  // Keep ref in sync with prop
  useEffect(()=>{ draftStateRef.current = draftState; }, [draftState]);

  // Clean up all timers on unmount
  useEffect(()=>()=>{
    clearTimeout(shuffleTimerRef.current);
    clearInterval(revealTimerRef.current);
  }, []);

  // Fallback — uses module-level DRAFT_INIT so draft page always renders something
  const ds_safe = sanitizeDraft(draftState) ?? DRAFT_INIT;

  const ds = ds_safe;
  const tNum = DRAFT_ORDER[ds.tierIdx];
  const teams = DRAFT_TIERS[tNum] || [];
  const isDone = ds.phase === "done";
  const isShuffling = ds.phase === "shuffling";
  const isRevealing = ds.phase === "revealing";
  const isIdle = ds.phase === "idle";
  const revealFinished = isRevealing && revealedCount >= OWNERS.length;

  function startShuffle(){
    if(ds.phase !== "idle") return;
    const tierTeams = [...(DRAFT_TIERS[DRAFT_ORDER[draftStateRef.current.tierIdx]] || [])];
    clearTimeout(shuffleTimerRef.current);

    setDraftState(s=>({...s, phase:"shuffling"}));
    setShuffleTeams([...tierTeams]);

    let tick = 0;
    const totalFast = 18, totalSlow = 8, total = totalFast + totalSlow;

    function doTick(){
      tick++;
      setShuffleTeams([...tierTeams].sort(()=>Math.random()-.5));
      if(tick < total){
        const delay = tick <= totalFast ? 100 : 240;
        shuffleTimerRef.current = setTimeout(doTick, delay);
      } else {
        // Shuffle done — build the assignment result
        const shuffled = [...tierTeams].sort(()=>Math.random()-.5);
        const result = OWNERS.map((o,i)=>({owner:o, team:shuffled[i]}));

        // Store in ref immediately so confirmAndAdvance always sees it
        pendingRef.current = result;
        revealedRef.current = 0;
        setRevealedCount(0);
        setShuffleTeams(shuffled);
        setDraftState(s=>({...s, phase:"revealing"}));

        // Reveal one at a time using setInterval for reliability
        clearInterval(revealTimerRef.current);
        let idx = 0;
        revealTimerRef.current = setInterval(()=>{
          idx++;
          revealedRef.current = idx;
          setRevealedCount(idx);
          if(idx >= OWNERS.length){
            clearInterval(revealTimerRef.current);
          }
        }, 900);
      }
    }
    shuffleTimerRef.current = setTimeout(doTick, 80);
  }

  async function confirmAndAdvance(){
    if(draftStateRef.current.phase !== "revealing") return;

    // If reveal isn't finished yet, skip to the end immediately
    if(revealedRef.current < OWNERS.length){
      clearInterval(revealTimerRef.current);
      revealedRef.current = OWNERS.length;
      setRevealedCount(OWNERS.length);
      return;
    }

    // Guard: must have pending assignments
    if(!pendingRef.current || pendingRef.current.length === 0) return;

    // Commit assignments using ref values (never stale)
    const current = draftStateRef.current;
    const result = pendingRef.current;
    const tierNum = DRAFT_ORDER[current.tierIdx];
    const newA = {};
    OWNERS.forEach(o=>{ newA[o] = [...(current.assignments[o]||[])]; });
    result.forEach(({owner, team})=>{
      newA[owner].push({team, tier:tierNum});
    });
    const nextIdx = current.tierIdx + 1;
    const newState = {
      ...current,
      assignments: newA,
      tierIdx: nextIdx,
      phase: nextIdx >= DRAFT_ORDER.length ? "done" : "idle",
    };

    // Update local state immediately so UI responds
    setDraftState(newState);

    // Reset UI refs/state
    pendingRef.current = [];
    revealedRef.current = 0;
    setRevealedCount(0);
    setShuffleTeams([]);

    // Save to storage — awaited so the poll guard stays up until write completes
    await saveDraft(newState);
  }

  function resetDraft(){
    clearTimeout(shuffleTimerRef.current);
    clearInterval(revealTimerRef.current);
    pendingRef.current = [];
    revealedRef.current = 0;
    setDraftState(DRAFT_INIT);
    setRevealedCount(0);
    setShuffleTeams([]);
    saveDraft(DRAFT_INIT);
  }

  function publishLeaderboard(){
    const n = {...draftStateRef.current, leaderboardPublished:true};
    setDraftState(n);
    saveDraft(n);
    setTab("leaderboard");
  }

  const progressDots = DRAFT_ORDER.map((t,i)=>{
    const done = i < ds.tierIdx || isDone;
    const active = i === ds.tierIdx && !isDone;
    return(
      <div key={t} style={{width:26,height:26,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,
        background:done?"#E8002D":active?"#1A1A2E":"#fff",
        color:done?"#fff":active?"#fff":"#8896A4",
        border:done?"none":active?"none":"1.5px solid #E2E8F0",
        fontFamily:"'Barlow Condensed',sans-serif"}}>
        {t}
      </div>
    );
  });

  return(
    <div style={{padding:"20px 24px"}}>
      {/* Owner columns */}
      <div className="draft-grid">
        {OWNERS.map((owner,oi)=>{
          const ownerTeams = ds.assignments[owner]||[];
          return(
            <div key={owner} className="card">
              <div style={{padding:"8px 14px",borderBottom:"1.5px solid #E2E8F0",display:"flex",alignItems:"center",gap:8}}>
                <div style={{width:10,height:10,borderRadius:"50%",background:OWNER_COLORS[oi],flexShrink:0}}/>
                <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:17,fontWeight:700,letterSpacing:".06em",color:OWNER_COLORS[oi]}}>{owner.toUpperCase()}</span>
                <span style={{marginLeft:"auto",fontSize:11,color:"#8896A4"}}>{ownerTeams.length}/12</span>
              </div>
              <div style={{padding:"8px 10px",minHeight:60}}>
                {ownerTeams.length===0
                  ? <span style={{fontSize:11,color:"#CBD5E0",fontStyle:"italic"}}>No teams yet</span>
                  : ownerTeams.map(({team,tier})=>(
                    <div key={team} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"3px 6px",marginBottom:2,borderRadius:5,background:"#F7F8FA",border:"1px solid #E2E8F0"}}>
                      <span style={{fontSize:12,fontWeight:500,color:"#1A1A2E",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flex:1}}>{team}</span>
                      <span style={{fontSize:10,color:"#8896A4",marginLeft:6,flexShrink:0}}>T{tier}</span>
                    </div>
                  ))
                }
              </div>
            </div>
          );
        })}
      </div>

      {/* Stage card */}
      <div className="card" style={{marginBottom:16}}>
        <div style={{padding:"12px 20px",borderBottom:"1.5px solid #E2E8F0",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            {isDone
              ? <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,fontWeight:700,color:"#2F855A",letterSpacing:".06em"}}>DRAFT COMPLETE</span>
              : <><div style={{background:"#E8002D",color:"#fff",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:17,padding:"2px 10px",borderRadius:5,letterSpacing:".06em"}}>TIER {tNum}</div>
                  <span style={{fontSize:12,color:"#8896A4"}}>{teams.join(" · ")}</span></>
            }
          </div>
          <button onClick={resetDraft} style={{fontSize:12,padding:"5px 14px",borderRadius:6,border:"1.5px solid #E2E8F0",background:"#fff",color:"#8896A4",cursor:"pointer",fontFamily:"inherit"}}
            onMouseEnter={e=>{e.target.style.borderColor="#E8002D";e.target.style.color="#E8002D";}}
            onMouseLeave={e=>{e.target.style.borderColor="#E2E8F0";e.target.style.color="#8896A4";}}>
            Reset draft
          </button>
        </div>

        <div style={{padding:"20px 24px"}}>
          {isDone ? (
            <div style={{textAlign:"center",padding:"20px 0"}}>
              <div style={{fontSize:36,marginBottom:10}}>🏆</div>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,fontWeight:700,color:"#1A1A2E",letterSpacing:".04em",marginBottom:6}}>ALL 48 TEAMS ASSIGNED</div>
              <div style={{fontSize:13,color:"#8896A4",marginBottom:24}}>Ready to go live? Publishing the leaderboard will activate the scoreboard tab for all viewers.</div>
              {!ds.leaderboardPublished
                ? <button onClick={publishLeaderboard}
                    style={{padding:"12px 40px",borderRadius:8,border:"none",background:"#E8002D",color:"#fff",fontSize:15,fontWeight:600,cursor:"pointer",letterSpacing:".03em",fontFamily:"inherit"}}>
                    Publish Leaderboard
                  </button>
                : <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"10px 20px",borderRadius:8,background:"#F0FFF4",border:"1.5px solid #C6F6D5",color:"#2F855A",fontSize:13,fontWeight:600}}>
                    ✓ Leaderboard is live — <button onClick={()=>setTab("leaderboard")} style={{background:"none",border:"none",color:"#2F855A",fontWeight:700,cursor:"pointer",textDecoration:"underline",fontSize:13,padding:0,fontFamily:"inherit"}}>View it</button>
                  </div>
              }
            </div>
          ) : (
            <>
              <div style={{marginBottom:20}}>
                <div style={{fontSize:11,color:"#8896A4",fontWeight:600,letterSpacing:".06em",textTransform:"uppercase",marginBottom:10}}>
                  {isIdle?"Teams in this tier":isShuffling?"Shuffling…":"Results"}
                </div>
                <div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap",minHeight:52}}>
                  {(isShuffling?shuffleTeams:isRevealing?pendingRef.current.map(p=>p.team):teams).map((team,i)=>{
                    const revealed = isRevealing && i < revealedCount;
                    const ownerForSlot = isRevealing ? pendingRef.current[i]?.owner : null;
                    const oi = ownerForSlot ? OWNERS.indexOf(ownerForSlot) : -1;
                    return(
                      <div key={i} className={revealed?"reveal-in":isShuffling?"shuffling":""}
                        style={{padding:"10px 18px",borderRadius:8,fontSize:14,fontWeight:600,
                          border:revealed?`2px solid ${OWNER_COLORS[oi]}`:"1.5px solid #E2E8F0",
                          background:revealed?"#fff":isShuffling?"#F7F8FA":"#F7F8FA",
                          color:revealed?OWNER_COLORS[oi]:"#1A1A2E",
                          minWidth:130,textAlign:"center",transition:"all .2s",
                          boxShadow:revealed?`0 0 0 4px ${OWNER_COLORS[oi]}22`:"none"}}>
                        {revealed&&<div style={{fontSize:10,fontWeight:700,opacity:.7,marginBottom:2,letterSpacing:".05em"}}>{ownerForSlot.toUpperCase()}</div>}
                        <div>{isRevealing&&i>=revealedCount?"?":team}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div style={{textAlign:"center"}}>
                {isIdle&&<button onClick={startShuffle} style={{padding:"11px 36px",borderRadius:8,border:"none",background:"#E8002D",color:"#fff",fontSize:14,fontWeight:600,cursor:"pointer",letterSpacing:".03em",fontFamily:"inherit"}}>Draw Tier {tNum}</button>}
                {isShuffling&&<button disabled style={{padding:"11px 36px",borderRadius:8,border:"none",background:"#E2E8F0",color:"#8896A4",fontSize:14,fontWeight:600,cursor:"not-allowed",fontFamily:"inherit"}}>Shuffling…</button>}
                {isRevealing&&!revealFinished&&<button onClick={confirmAndAdvance} style={{padding:"11px 36px",borderRadius:8,border:"1.5px solid #CBD5E0",background:"#fff",color:"#4A5568",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Skip to all results</button>}
                {isRevealing&&revealFinished&&<button onClick={confirmAndAdvance} style={{padding:"11px 36px",borderRadius:8,border:"none",background:"#1A1A2E",color:"#fff",fontSize:14,fontWeight:600,cursor:"pointer",letterSpacing:".03em",fontFamily:"inherit"}}>{ds.tierIdx<DRAFT_ORDER.length-1?`Confirm & draw Tier ${DRAFT_ORDER[ds.tierIdx+1]}`:"Confirm & finish draft"}</button>}
              </div>
            </>
          )}
        </div>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap",justifyContent:"center"}}>
        <span style={{fontSize:11,color:"#8896A4",marginRight:4}}>Progress:</span>
        {progressDots}
      </div>

      {/* All teams reference table */}
      <div className="card" style={{marginTop:24}}>
        <div style={{padding:"10px 16px",borderBottom:"1.5px solid #E2E8F0",display:"flex",alignItems:"center",gap:10}}>
          <div style={{background:"#1A1A2E",color:"#fff",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:15,letterSpacing:".06em",padding:"2px 10px",borderRadius:5}}>ALL TEAMS · TIERS & ODDS</div>
          <span style={{fontSize:11,color:"#8896A4"}}>BetMGM · April 29, 2026</span>
        </div>
        <div style={{padding:"12px 16px"}}>
          {DRAFT_ORDER.map(tierNum => {
            const teams = DRAFT_TIERS[tierNum] || [];
            const isDouble = DOUBLE_PT_TIERS.has(tierNum);
            const tierColors = {
              1:"#2F855A", 2:"#2F855A",
              3:"#276749", 4:"#276749",
              5:"#B7791F", 6:"#B7791F",
              7:"#4A5568", 8:"#4A5568",
              9:"#C05621", 10:"#C05621",
              11:"#9B2C2C", 12:"#9B2C2C",
            };
            const TIER_ODDS = {
              12: {"Curaçao":"+250000", "Haiti":"+250000", "South Africa":"+100000", "Uzbekistan":"+100000"},
              11: {"New Zealand":"+100000", "Panama":"+100000", "Qatar":"+100000", "Saudi Arabia":"+100000"},
              10: {"Cape Verde":"+100000", "DR Congo":"+75000", "Iraq":"+100000", "Jordan":"+100000"},
              9: {"Australia":"+50000", "Iran":"+50000", "South Korea":"+25000", "Tunisia":"+50000"},
              8: {"Bosnia and Herzegovina":"+25000", "Egypt":"+25000", "Ghana":"+25000", "Scotland":"+25000"},
              7: {"Algeria":"+25000", "Czech Republic":"+20000", "Ivory Coast":"+20000", "Paraguay":"+15000"},
              6: {"Austria":"+10000", "Canada":"+15000", "Switzerland":"+6600", "Turkey":"+6600"},
              5: {"Ecuador":"+6600", "Mexico":"+6600", "Senegal":"+6600", "Sweden":"+6600"},
              4: {"Croatia":"+6600", "Japan":"+5000", "United States":"+4000", "Uruguay":"+5000"},
              3: {"Belgium":"+3300", "Colombia":"+4000", "Morocco":"+4000", "Norway":"+2500"},
              2: {"Brazil":"+800", "Germany":"+1400", "Netherlands":"+2000", "Portugal":"+1000"},
              1: {"Argentina":"+800", "England":"+650", "France":"+450", "Spain":"+500"},
            };
            const color = tierColors[tierNum] || "#4A5568";
            return (
              <div key={tierNum} style={{marginBottom:12}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                  <div style={{background:color,color:"#fff",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:13,padding:"1px 8px",borderRadius:4,letterSpacing:".06em"}}>TIER {tierNum}</div>
                  {isDouble && <span style={{fontSize:10,fontWeight:700,background:"#FFFBEB",color:"#92400E",border:"1px solid #FDE68A",borderRadius:4,padding:"1px 6px"}}>×2 POINTS</span>}
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(175px,1fr))",gap:5}}>
                  {[...teams].sort().map(team => (
                    <div key={team} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"4px 8px",borderRadius:5,background:"#F7F8FA",border:"1px solid #E2E8F0"}}>
                      <span style={{fontSize:12,fontWeight:500,color:"#1A1A2E",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flex:1}}>{team}</span>
                      <span style={{fontSize:11,fontWeight:600,color:color,marginLeft:8,flexShrink:0}}>{(TIER_ODDS[tierNum]||{})[team] || "—"}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── LEADERBOARD TAB ─────────────────────────────────────────────────────────
function LeaderboardTab({draftState, allSt, thirds, top8groups, gScores}) {
  const [expanded, setExpanded] = useState({});

  const scores = useMemo(()=>{
    if(!draftState?.assignments) return [];
    return OWNERS.map((owner, oi)=>{
      const ownerTeams = draftState.assignments[owner] || [];
      const teamScores = ownerTeams.map(({team, tier})=>{
        const score = computeTeamScore(team, allSt, thirds, top8groups, gScores);
        const isDouble = DOUBLE_PT_TIERS.has(tier);
        const finalTotal = isDouble ? score.total * 2 : score.total;
        return { team, tier, isDouble, score, finalTotal };
      });
      const total = teamScores.reduce((s,t)=>s+t.finalTotal, 0);
      return { owner, oi, teamScores, total };
    }).sort((a,b)=>b.total-a.total);
  }, [draftState, allSt, thirds, top8groups, gScores]);

  const maxTotal = scores[0]?.total || 1;

  const toggle = (owner) => setExpanded(e=>({...e, [owner]:!e[owner]}));

  const RANK_MEDALS = ["🥇","🥈","🥉","4"];

  return(
    <div style={{padding:"20px 24px",maxWidth:820}}>
      {/* Header note */}
      <div style={{fontSize:12,color:"#8896A4",marginBottom:16,display:"flex",alignItems:"center",gap:6}}>
        <span style={{width:8,height:8,borderRadius:"50%",background:"#2F855A",display:"inline-block",flexShrink:0}}/>
        Live — updates in real time as group stage scores are entered
      </div>

      {/* Leaderboard rows */}
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {scores.map(({owner, oi, teamScores, total},rank)=>{
          const color = OWNER_COLORS[oi];
          const isOpen = expanded[owner];
          // bar width relative to leader
          const barPct = maxTotal > 0 ? Math.round((total/maxTotal)*100) : 0;
          return(
            <div key={owner} className="card" style={{overflow:"visible"}}>
              {/* Main row — clickable */}
              <div className="lb-row" onClick={()=>toggle(owner)}
                style={{padding:"14px 20px",display:"flex",alignItems:"center",gap:14}}>
                {/* Rank */}
                <div style={{width:28,textAlign:"center",fontSize:rank<3?20:15,flexShrink:0}}>
                  {rank<3?RANK_MEDALS[rank]:<span style={{fontWeight:700,color:"#8896A4",fontFamily:"'Barlow Condensed',sans-serif",fontSize:18}}>{rank+1}</span>}
                </div>
                {/* Color dot + name */}
                <div style={{display:"flex",alignItems:"center",gap:8,flex:"0 0 120px"}}>
                  <div style={{width:12,height:12,borderRadius:"50%",background:color,flexShrink:0}}/>
                  <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,fontWeight:700,color,letterSpacing:".05em"}}>{owner.toUpperCase()}</span>
                </div>
                {/* Bar */}
                <div style={{flex:1,height:8,background:"#F0F2F5",borderRadius:4,overflow:"hidden"}}>
                  <div style={{width:`${barPct}%`,height:"100%",background:color,borderRadius:4,transition:"width .4s ease"}}/>
                </div>
                {/* Total */}
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:26,fontWeight:700,color:"#1A1A2E",minWidth:44,textAlign:"right"}}>{total}</div>
                <div style={{fontSize:11,color:"#8896A4",minWidth:30}}>pts</div>
                {/* Expand chevron */}
                <div style={{fontSize:14,color:"#8896A4",transition:"transform .2s",transform:isOpen?"rotate(180deg)":"rotate(0deg)"}}>▾</div>
              </div>

              {/* Expanded team breakdown */}
              {isOpen && (
                <div style={{borderTop:"1.5px solid #F0F2F5",padding:"0 20px 14px"}}>
                  {/* Column headers */}
                  <div style={{display:"grid",gridTemplateColumns:"1fr 60px 60px 60px 60px 70px",gap:4,padding:"8px 0 4px",fontSize:10,fontWeight:600,color:"#8896A4",letterSpacing:".06em",textTransform:"uppercase",borderBottom:"1px solid #F0F2F5",marginBottom:4}}>
                    <div>Team</div>
                    <div style={{textAlign:"center"}}>Goals</div>
                    <div style={{textAlign:"center"}}>Grp Pts</div>
                    <div style={{textAlign:"center"}}>Position</div>
                    <div style={{textAlign:"center"}}>Base</div>
                    <div style={{textAlign:"right"}}>Pool Pts</div>
                  </div>
                  {[...teamScores].sort((a,b)=>b.finalTotal-a.finalTotal).map(({team, tier, isDouble, score, finalTotal})=>(
                    <div key={team} className="team-row-expand"
                      style={{display:"grid",gridTemplateColumns:"1fr 60px 60px 60px 60px 70px",gap:4,padding:"5px 0",borderBottom:"1px solid #F7F8FA",alignItems:"center"}}>
                      {/* Team name + double badge */}
                      <div style={{display:"flex",alignItems:"center",gap:6}}>
                        <span style={{fontSize:13,fontWeight:500,color:"#1A1A2E"}}>{team}</span>
                        {isDouble && (
                          <span style={{fontSize:10,fontWeight:700,background:"#FFFBEB",color:"#92400E",border:"1px solid #FDE68A",borderRadius:4,padding:"1px 5px",letterSpacing:".04em",flexShrink:0}}>×2</span>
                        )}
                        <span style={{fontSize:10,color:"#CBD5E0",flexShrink:0}}>T{tier}</span>
                      </div>
                      {/* Goals */}
                      <div style={{textAlign:"center",fontSize:13,color:"#4A5568"}}>{score.breakdown.goals}</div>
                      {/* Group pts */}
                      <div style={{textAlign:"center",fontSize:13,color:"#4A5568"}}>{score.breakdown.groupPts}</div>
                      {/* Position bonus */}
                      <div style={{textAlign:"center",fontSize:12,color:score.breakdown.position>0?"#2F855A":"#CBD5E0"}}>
                        {score.breakdown.position>0
                          ? <span title={score.breakdown.positionLabel} style={{cursor:"default"}}>+{score.breakdown.position}</span>
                          : "—"}
                      </div>
                      {/* Base total */}
                      <div style={{textAlign:"center",fontSize:13,color:"#4A5568"}}>{score.total}</div>
                      {/* Final pool pts */}
                      <div style={{textAlign:"right",fontSize:14,fontWeight:700,color:isDouble?"#B45309":finalTotal>0?"#1A1A2E":"#CBD5E0"}}>
                        {finalTotal}
                        {isDouble && score.total > 0 && <span style={{fontSize:10,color:"#B45309",marginLeft:2}}>×2</span>}
                      </div>
                    </div>
                  ))}
                  {/* Owner subtotal */}
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:8,marginTop:4,borderTop:"1.5px solid #E2E8F0"}}>
                    <span style={{fontSize:12,color:"#8896A4"}}>{teamScores.filter(t=>t.isDouble).length} double-point teams</span>
                    <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:18,fontWeight:700,color}}>{total} pts total</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Scoring key */}
      <div style={{marginTop:20,padding:"12px 16px",background:"#fff",border:"1.5px solid #E2E8F0",borderRadius:10}}>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,fontWeight:700,color:"#1A1A2E",letterSpacing:".06em",marginBottom:8}}>SCORING RULES</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:6,fontSize:12,color:"#4A5568"}}>
          <div>⚽ 1 pt per goal scored</div>
          <div>📋 1 pt per group stage point (W=3, D=1)</div>
          <div>🥇 3 pts for winning the group</div>
          <div>🥈 2 pts for finishing 2nd</div>
          <div>🌟 1 pt for best 3rd (advancing)</div>
          <div style={{color:"#92400E",fontWeight:600}}>×2 double points for tiers 9–12 (longest shots)</div>
        </div>
      </div>
    </div>
  );
}
