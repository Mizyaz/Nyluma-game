# Ajan istemleri

Bu klasörde, kullanıcı "başlat" deyince sırayla çalışacak ajanların istemleri
var. Her dosya kendi başına eksiksiz bir istemdir. Lider (bu repoda çalışan ana
ajan) başlatırken yalnızca yolları doldurur, sonuna commit imza satırlarını ve
kullanıcının değiştirdiği kararları ekler.

Durum (3 Ekim 2026): üç istem de hazır, hiçbiri başlatılmadı. Kullanıcı
"başlat" demedikçe başlatma.

| Sıra | İstem | İş | Dal | Çalışma kopyası | Portlar |
| --- | --- | --- | --- | --- | --- |
| 1 | [1-yatak.md](1-yatak.md) | Yaşayan yatak: dallanıp çiçek açan, Gorti'yi kaldıran yatak; daha sanatlı bir uyanış | `living-bed` | `{ROOT}/kd-bed` | 5451, 5611–5613 |
| 2 | [2-balinalar.md](2-balinalar.md) | Dinamik balinalar: bükülen gövde, kuyruk vuruşu, topraktan sıçrama, dalış, türüne özgü nefes | `whale-motion` | `{ROOT}/kd-whales` | 5461, 5621–5623 |
| 3 | [3-dusmanlar.md](3-dusmanlar.md) | Haylazlar (düşmanlar) ve Gorti'nin yeni aksiyon hareketleri | `rascals` | `{ROOT}/kd-foes` | 5471, 5631–5633 |

Düşmanlar sona kondu: kullanıcı önce tasarımı konuşmak istedi. Kullanıcı
isterse sıra değişir.

Kullanıcıya sorulan ve henüz cevaplanmayan üç soru var:

1. Ton: yumuşak "haylaz"lar mı (varsayılan), gerçek dövüş mü?
2. Dokununca: tomurcuk kapanması mı (varsayılan), yalnızca geri itilme mi?
3. Yer: önce talim odası `b05` mi (varsayılan), doğrudan hikâye bölümleri mi?

Cevap gelmezse aşağıdaki varsayılanlar geçerli.

## Düşman tasarımının varsayılanları (kullanıcı değiştirebilir)

- **Ad:** Oyunda "haylaz" deniyor. Kötü değil, yaramazlar. Ölüm, can barı ya da
  oyun sonu yok. Sakinleştirilen her haylaz güzel bir şeye dönüşüyor.
- **Damga Böceği:** Komite'nin memurları.
  - Zıplayıp "DEVREDİLDİ" damgası vuruyor.
  - Sırtüstü kalınca sakinleştirilebiliyor.
  - Kâğıt kayığa ya da kâğıt kuşa dönüşüyor.
- **Tik-Tak:** Gorti'nin gençliğindeki kurmalı saat askeri.
  - Ritimle yürüyor, alarm halkası yayıyor.
  - Ritmi bozulunca ya da anahtarı koparılınca sakinleşiyor.
  - Müzik kutusuna, sonra teneke kuşa dönüşüyor.
- **Yalan Gölgesi:** Gorti'nin biraz yanlış bir kopyası olan mürekkep lekesi.
  - Yerde ve duvarda kayıyor, lambaları karartıyor.
  - Işıkla sakinleşiyor.
  - Daldaki bir meyveye dönüşüyor.
- **Dokunulunca:** Gorti biraz geri itiliyor ve başındaki tomurcuklardan biri
  kapanıyor. Üçü de kapanırsa iki saniye sersemleyip oturuyor, sonra tomurcuklar
  yeniden açılıyor.
- **Gorti'nin yeni hareketleri:**
  - **Sarmaşık Uzanışı:** yakalayıp çiçekli sarmaşıkla sarar.
  - **Kâğıt Kaçış:** kâğıt gibi yan dönüp içinden geçirir.
  - **Kök Dalgası:** havadan inip yerde kristal halka yayar.
  - **Gerçek Ad:** her haylazın üç notalık adını söyleyince sakinleşir.
- **Nerede:** İlk turda yalnızca 6. bölümde yeni bir talim odası (`b05`
  "Haylazlar Odası"). Hikâye odalarına kullanıcı gördükten sonra karar verilir.

## Başlatma (lider için)

İstemlerde iki yer tutucu var:

- `{MAIN}`: ana kopyanın yolu, yani bu reponun klonu (örneğin `/home/user/Nyluma-game`).
- `{ROOT}`: ana kopyanın bulunduğu klasör (örneğin `/home/user`). Ajanların
  çalışma kopyaları ve ekran görüntüleri bunun altına gider.

Her ajan için, sırası gelince (örnek: yatak):

```bash
cd {MAIN}
ROOT=$(dirname "$PWD")
git worktree add -b living-bed "$ROOT/kd-bed" paper-engine
ln -s "$PWD/node_modules" "$ROOT/kd-bed/node_modules"
mkdir -p "$ROOT/kd-shots/bed/"
sed -e "s#{MAIN}#$PWD#g" -e "s#{ROOT}#$ROOT#g" docs/briefs/1-yatak.md > "$ROOT/kd-shots/bed/istem.md"
```

`paper-engine` yerine, o an yayında olan dal hangisiyse (`main`) ondan da
açılabilir; ikisi aynı committe tutuluyor. İstemde "paper-engine" geçen
yerleri de buna göre değiştir.

Ajana `istem.md`'nin tamamı verilir. Sonuna şunlar eklenir:

- liderin kendi oturumunun iki commit imza satırı (Co-Authored-By ve
  Claude-Session). Bu satırlar repoya başka hiçbir yere yazılmaz;
- kullanıcının değiştirdiği kararlar.

Ekran görüntüsü araçları repoda: `scripts/snap.mjs` ve `scripts/montage.py`.

Ajan bitince:

1. İş incelenir, raporu ve ekran görüntüleri açılıp bakılır.
2. Dal `paper-engine`'e `--no-ff` ile birleştirilir.
3. Bütün kontroller ve iki kampanya koşulur.
4. `QA_REPORT.md`'ye bölüm yazılır ve iş yayınlanır.
5. Sonra sıradaki ajan başlar.

Ajan raporu kullanıcı onayı değildir. Kullanıcıya kısa Türkçe durum bildirilir
ve görüntü gösterilir.
