// Concise active objectives and physical-action hints (Turkish).
export interface Objective {
  text: string;
  hint: string;
}

export const OBJECTIVES: Record<string, Objective> = {
  'r01.explore': {
    text: 'Odayı tanı: üç şeyi incele.',
    hint: 'Oyuncak balinaya, duvardaki çentiklere ve pencereye yaklaşıp E’ye bas. Pencereye ulaşmak için altındaki sandığa zıpla (Boşluk).',
  },
  'r01.door': { text: 'Kök kapıdan geç.', hint: 'Sağdaki kök kapı artık açık. Sağa yürü.' },
  'r02.whale': { text: 'Fosil köklerin arasında ilerle.', hint: 'Dikenlerin üstünden zıpla (Boşluk) ve sağdaki turkuaz tomurcuğa yaklaş.' },
  'r02.song': {
    text: 'Turkuaz tomurcuğa balina dilini söyle.',
    hint: 'Tomurcuğun yanında F’ye bas. Deseni dinle, sonra aynı sırayla söyle: ← derin, ↓ orta, → yüksek (A, S, D).',
  },
  'r02.climb': { text: 'Uyanan köklere tırman.', hint: 'Kök basamaklarına sırayla zıpla. Basamakların içinden aşağıdan geçebilirsin.' },
  'r02.reach': { text: 'Parlayan düğüme uzan.', hint: 'Sol kenara yürü, düğüme dön ve E’ye bas; kök seni karşıya çeker.' },
  'r02.top': {
    text: 'Yukarıdaki geçide ulaş.',
    hint: 'Basamaklardan tırman, sağdaki düğüme E ile uzan; sonra kök basamaklardan sağ üstteki geçide çık. Süzülen ışığı E ile dağıtabilirsin.',
  },
  'r03.cross': {
    text: 'Zehirli havuzun ötesine geç.',
    hint: 'Tüneldeki kararsız kristalleri E ile dağıt. Havuzun kenarında düğümlere dönüp E’ye bas.',
  },
  'r03.focus': {
    text: 'Nefesini tutarak gizli kristalleri görünür kıl.',
    hint: 'Uçurumun kenarında Q’yu basılı tut ve beliren kristal basamaklardan karşıya zıpla. Düşersen soldaki basamaktan geri çık.',
  },
  'r03.moon': { text: 'Tomurcukla göğe seslen.', hint: 'Kristal ağacın solundaki tomurcuğun yanında F’ye bas ve deseni tekrar et.' },
  'r03.sun': { text: 'Güneş’e de seslen.', hint: 'Aynı tomurcukta yeniden F’ye bas. Bu kez desen dört sesli.' },
  'r03.star': { text: 'Dalın üstündeki küçük yıldızı al.', hint: 'Ağacın alt dallarına sırayla zıpla; yıldız üçüncü daldadır. Yanında E’ye bas.' },
  'r03.bind': { text: 'Yıldızı kristal ağaca bağla.', hint: 'Ağacın gövdesinin dibine in ve E’ye bas.' },
  'r03.climb': { text: 'Açan dallardan yeryüzüne tırman.', hint: 'Yeni dallara sırayla zıpla; en üstteki daldan toprak yarılır.' },
  'r04.walk': { text: 'Rüzgârı izle.', hint: 'Sağa yürü.' },
  'r04.focus': {
    text: 'Nefesini tut ve kristal basamaklardan yükseğe çık.',
    hint: 'Çukurun kenarında Q’yu basılı tut; beliren basamaklara zıpla. Düşersen çukurdan sola geri çıkabilirsin.',
  },
  'r04.pool': { text: 'Anı havuzuna bak.', hint: 'Yukarıdaki düzlükte havuzun yanında E’ye bas.' },
  'r04.ground': { text: 'Yeni bedeninde dengeyi bul.', hint: 'Q’yu basılı tut.' },
  'r04.onward': { text: 'Yola devam et.', hint: 'Sağa yürü. İşaretli dairede R ile biçim değiştirebilirsin.' },
  'r05.stone': {
    text: 'Anı taşını basınç levhasına it.',
    hint: 'İnsan bedeniyle taşa doğru yürümeye devam et. Kök bedendeysen soldaki dairede R’ye bas. Taş takılırsa sunağın yanında E.',
  },
  'r05.reach': { text: 'Yükselen yola ulaş.', hint: 'Levhanın solundaki dairede R ile kök bedene dön, sonra yolun ucundaki düğüme E ile uzan.' },
  'r05.stone2': {
    text: 'İkinci taşı yolun ucundan aşağıya it.',
    hint: 'Yolun üstündeki dairede insan bedenine geç (R) ve taşı sağa, kenardan aşağı it.',
  },
  'r05.gate': { text: 'Kristal kapıdan geç ve tepeye çık.', hint: 'Kapının ötesindeki dairede kök bedene dön (R), sonra düğümlere E ile uzan.' },
  'r05.hill': { text: 'Tepeye çık.', hint: 'Sağa, tepenin ortasına yürü.' },
  'r05.leave': { text: 'Ormanın derinliklerine yürü.', hint: 'Tepenin sağ ucuna yürü.' },
  'r06.walk': { text: 'Ormanın içine yürü.', hint: 'Sağa yürü.' },
  'r06.knots': {
    text: 'Üç kök düğümünü dengele.',
    hint: 'Düğümün yanında Q’yu basılı tutarak halkayı doldur, sonra E’ye bas. Yerdeki çatlak parladığında uzak dur.',
  },
  'r06.mount': { text: 'Mor ata bin.', hint: 'Tümseğin üstündeki atın yanına git ve E’ye bas.' },
  'r07.ride': { text: 'Atla Güneş’e doğru ilerle.', hint: 'Boşluk: zıpla. Uçurum önünde Q: çiçek köprüsü. ← → ile hızını biraz ayarlayabilirsin.' },
  'r08.p1': {
    text: 'Kırık ışınlardan kaç, iki çiçeği uyandır.',
    hint: 'Işın gelmeden önce yerde soluk bir iz belirir: kırık aralıkta dur ya da zıpla. Çiçeklerin yanında E’ye bas.',
  },
  'r08.p2': { text: 'Balıkları yükselen akıntıya taşı.', hint: 'Parlayan akıntının yanına git ve E’ye bas; üç akıntıyı sırayla aç.' },
  'r08.p3': {
    text: 'Güneş gözlerini açınca balıkları fırlat.',
    hint: 'Güneş’in çevresinde halka belirince Q’yu basılı tut; balıklar etrafında toplanınca bırak.',
  },
  'r08.leave': { text: 'Serçeyi izle.', hint: 'Sağa yürü.' },
  'r09.follow': { text: 'Serçeyi izle.', hint: 'Sağa yürü; serçe seni bekler. Nehri taşlardan geçebilirsin.' },
  'r09.pool': { text: 'Yansıyan havuzda gözlerini kapat.', hint: 'Sağdaki havuzun yanında E’ye bas.' },
  'r10.stations': {
    text: 'Meşaleyi üç anı istasyonuna taşı.',
    hint: 'İstasyonun yanında E’ye bas. Parçaları ters sıraya diz: bir parçayı seç, sonra yer değiştireceği parçayı seç.',
  },
  'r10.torch': { text: 'Meşalenin ışığını koru.', hint: 'E’ye tekrar tekrar bas ya da basılı tut.' },
  'r11.key': { text: 'Anahtar gözünü duvardaki anahtar izine hizala.', hint: 'Konsolda E’ye bas; ← → ile gözü çevir, iz ile örtüşünce E.' },
  'r11.lock': { text: 'Gizli kilidi bul.', hint: 'Uçurum duvarının önünde Q’yu basılı tut: anahtar deliği göz kilidi gösterir. Sonra E.' },
  'r11.legs': { text: 'Gorti’nin bacaklarına ulaş ve onu uyandır.', hint: 'Beliren basamaklardan tırman; bacakların yanında E’yi basılı tut.' },
  'r12.door': { text: 'Koridorun sonundaki kapıyı aç.', hint: 'Sağa yürü ve kapının önünde E’ye bas.' },
  'r12.read': { text: 'Masadaki belgeleri incele.', hint: 'Masanın çevresindeki üç belgenin yanında E’ye bas.' },
  'r12.final': { text: 'Son sayfayı çevir.', hint: 'Masanın ortasında E’ye bas.' },
};
