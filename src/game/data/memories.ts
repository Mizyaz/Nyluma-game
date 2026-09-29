import type { RoomId } from '../state/types';

// Eight optional illustrated memory fragments (≤ 60 words each). They enrich
// remembered lives, animals and places without explaining the mysteries.

export interface MemoryDef {
  id: string;
  room: RoomId;
  title: string;
  text: string;
  /** Illustration key in art/memoryArt.ts */
  art: string;
}

export const MEMORIES: MemoryDef[] = [
  {
    id: 'm1',
    room: 'r02',
    title: 'Kuyu Başında',
    text: 'Bir köy kuyusunun başında bir kadın, kovayı çekmeden önce suya şarkı söylerdi. Bir sabah su mavi parladı. Kova ağırlaştı ama şarkı bitmedi. Kuyunun dibinde ışık bir balığın şeklini almıştı; balık kıpırdamıyor, yalnızca parlıyordu.',
    art: 'well',
  },
  {
    id: 'm2',
    room: 'r03',
    title: 'Tahta Balina',
    text: 'Bir baba, kış boyunca kızı için tahtadan bir balina oydu. Kız balinayı yastığının altına koyar, sabahları kulağına dayardı. Balina hiç ses çıkarmadı. Yine de kız, her sabah biraz daha uzak bir denizden uyandığına yemin ederdi.',
    art: 'toywhale',
  },
  {
    id: 'm3',
    room: 'r04',
    title: 'Rakunun Taşı',
    text: 'Bir rakun, dereden çıkardığı kristal bir taşı patileriyle yıkamaya çalıştı. Taş temizlendikçe parladı, parladıkça rakun daha çok yıkadı. Sonunda dere mavi aktı. Rakun taşı bıraktı; ama patileri o geceden beri karanlıkta hafifçe ışıdı.',
    art: 'raccoon',
  },
  {
    id: 'm4',
    room: 'r05',
    title: 'Sivas’ta Kar',
    text: 'Kar yağarken bir kahvehanede kel bir adam çayını karıştırıyordu. Kaşık bardağa her değdiğinde, buğulu camda bir yüz belirip kayboldu. Adam başını hiç kaldırmadı. “Acele eden,” dedi kendi kendine, “kendi yüzünü de geçer.”',
    art: 'tea',
  },
  {
    id: 'm5',
    room: 'r06',
    title: 'Derin Ses',
    text: 'Buzların altında yaşlı bir balina, yavrusuna en derin sesi öğretiyordu. “Yüksek ses uzağa gider,” dedi, “derin ses ise geri döner.” Yavru ilk derin sesini çıkardığında, dönen yankının içinde kendi adını duydu; daha önce hiç duymadığı bir dilde.',
    art: 'whales',
  },
  {
    id: 'm6',
    room: 'r07',
    title: 'Irkutsk’ta Buz',
    text: 'Nehir donduğunda bir çocuk buzun üstüne yüzüstü yattı ve altından geçen balıkları saydı. Saymayı bıraktığında bir balık durdu ve ona baktı. Pulları mor bir ışıkla doluydu. Çocuk o kış boyunca, bir balığın gözünde büyüdüğünü hissetti.',
    art: 'ice',
  },
  {
    id: 'm7',
    room: 'r09',
    title: 'Kayıştan Yuva',
    text: 'Bir serçe, yuvasını eski bir kol saatinin kayışından ördü. Yavrular her gece tiktakların arasında uyudu. Kayış çürüyünce saat düştü; ama yavrular zamanı çoktan öğrenmişti. Her sabah, güneşten bir dakika önce uyandılar.',
    art: 'nest',
  },
  {
    id: 'm8',
    room: 'r11',
    title: 'Mesai',
    text: 'Bir memur, yirmi yıl boyunca her sabah aynı saatte aynı kapıdan girdi. Bir gün kapı açılmadı. Öğle oldu, saat biri geçti; memur bekledi. Sonra anladı: kapı kilitli değildi. Yalnızca onu hatırlamayı bırakmıştı.',
    art: 'door',
  },
];

export const MEMORY_IDS: readonly string[] = MEMORIES.map((m) => m.id);

export function memoryDef(id: string): MemoryDef | undefined {
  return MEMORIES.find((m) => m.id === id);
}
