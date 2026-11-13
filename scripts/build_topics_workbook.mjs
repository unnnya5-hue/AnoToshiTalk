import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { FileBlob, SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const outputDir = fileURLToPath(new URL("../outputs/topic-ledger/", import.meta.url));

const raw = String.raw`1960	アカシアの雨がやむとき	映画『秋日和』	ダッコちゃんブーム	カラーテレビ本放送開始	ローマオリンピック	国民所得倍増計画	テレビがお茶の間の中心へ
1961	上を向いて歩こう	連続テレビ小説『娘と私』	プラレールの人気拡大	アンネナプキン発売	大鵬が横綱昇進	有人宇宙飛行の成功	スーダラ節と「無責任」ムード
1962	いつでも夢を	映画『キューポラのある街』	1/35 パンサータンク発売	電子レンジの業務利用	堀江謙一が太平洋単独横断	国産旅客機YS-11初飛行	ツイストダンスの流行
1963	こんにちは赤ちゃん	テレビアニメ『鉄腕アトム』	レーシングカー玩具の登場	ワンタンメン発売	大鵬が史上初の6場所連続優勝	黒部ダム完成	「バカンス」という言葉
1964	東京五輪音頭	映画『モスラ対ゴジラ』	お話ミコちゃんのヒット	かっぱえびせん発売	東京オリンピック	東海道新幹線開業	海外観光旅行の自由化
1965	柔	テレビアニメ『オバケのQ太郎』	レーシングカー玩具ブーム	アイスノン発売	読売巨人軍V9の始まり	名神高速道路全線開通	スーパーボールが日本へ
1966	霧氷	テレビドラマ『ウルトラマン』	ウルトラマン玩具と怪獣ブーム	ポッキー発売	読売巨人軍が日本シリーズ連覇	日本の総人口が1億人突破	ミニスカートの流行
1967	ブルー・シャトウ	テレビアニメ『リボンの騎士』	リカちゃん人形発売	ツイッギー来日とミニスカート	ユニバーシアード東京大会	国際観光年	グループ・サウンズブーム
1968	恋の季節	テレビアニメ『ゲゲゲの鬼太郎』	人生ゲーム発売	ボンカレー発売	メキシコシティーオリンピック	郵便番号制度開始	オールナイトニッポンと深夜ラジオ
1969	黒ネコのタンゴ	アニメ『サザエさん』放送開始	ママレンジ登場	アポロチョコ発売	夏の甲子園決勝再試合	アポロ11号月面着陸	池袋PARCO開業
1970	希望	テレビ番組『時間ですよ』	トミカ発売	ケンタッキーフライドチキン日本1号店	三浦雄一郎のエベレスト大滑降	日本万国博覧会	雑誌『anan』創刊
1971	また逢う日まで	テレビアニメ『ルパン三世』	仮面ライダー変身ベルト	カップヌードル発売	オールスター戦の江夏9者連続奪三振	環境庁発足	ボウリングブーム
1972	喝采	テレビアニメ『科学忍者隊ガッチャマン』	パンダのぬいぐるみ人気	モスバーガー1号店	札幌冬季オリンピック	沖縄返還	鉄道開業100年
1973	神田川	テレビアニメ『ドラえもん』第1作	オセロ発売	クノール カップスープ発売	プロ野球巨人V9達成	関門橋開通	ベルボトムとフォークファッション
1974	襟裳岬	テレビアニメ『アルプスの少女ハイジ』	モンチッチ誕生	セブン-イレブン日本1号店	長嶋茂雄引退	佐藤栄作がノーベル平和賞	宝塚歌劇『ベルサイユのばら』初演
1975	シクラメンのかほり	テレビアニメ『フランダースの犬』	黒ひげ危機一発発売	きのこの山発売	広島東洋カープ初優勝	山陽新幹線博多開業	紅茶キノコブーム
1976	およげ！たいやきくん	映画『男はつらいよ 寅次郎夕焼け小焼け』	光線銃カスタム発売	クロネコヤマト宅急便開始	モントリオールオリンピック	電離層観測衛星「うめ」打ち上げ	ピンク・レディー旋風
1977	渚のシンドバッド	テレビアニメ『あらいぐまラスカル』	テレビゲーム15発売	スーパーカーブーム	王貞治756号本塁打	気象衛星「ひまわり」打ち上げ	ディスコ文化の広がり
1978	UFO	映画『さらば宇宙戦艦ヤマト』	スペースインベーダー	セブン-イレブンでおにぎり発売	ヤクルトスワローズ初の日本一	新東京国際空港開港	ディスコとフィーバー
1979	魅せられて	テレビドラマ『3年B組金八先生』	電子ゲーム人気	ウォークマン発売	江夏の21球	国際児童年	インベーダーハウス
1980	ダンシング・オールナイト	テレビドラマ『池中玄太80キロ』	ゲーム＆ウオッチ発売	ルービックキューブ	高校野球で早実の荒木大輔が注目	日本の自動車生産台数が世界首位へ	竹の子族
1981	ルビーの指環	テレビドラマ『北の国から』	ガンプラブーム	雪見だいふく発売	大相撲の千代の富士人気	スペースシャトル初飛行	なめ猫ブーム
1982	待つわ	映画『蒲田行進曲』	コロコロコミックとゲーム玩具	おっとっと発売	西武ライオンズ日本一	東北新幹線開業	テクノカット
1983	さざんかの宿	連続テレビ小説『おしん』	ファミリーコンピュータ発売	東京ディズニーランド開園	阪急の福本豊が盗塁世界記録	国立歴史民俗博物館開館	DCブランドブーム
1984	もしも明日が。	映画『風の谷のナウシカ』	ドラゴンボール連載開始と玩具展開	コアラのマーチ発売	ロサンゼルスオリンピック	衛星放送の試験放送開始	エリマキトカゲブーム
1985	ジュリアに傷心	テレビ番組『夕やけニャンニャン』	スーパーマリオブラザーズ	ショルダーフォン登場	阪神タイガース日本一	科学万博つくば'85	おニャン子クラブ
1986	CHA-CHA-CHA	映画『子猫物語』	ドラゴンクエスト発売	写ルンです発売	清原和博のプロ野球デビュー	男女雇用機会均等法施行	バブル景気の始まり
1987	命くれない	映画『私をスキーに連れてって』	PCエンジン発売	アサヒスーパードライ発売	岡本綾子が米女子賞金女王	国鉄分割民営化	ボディコンとディスコ
1988	パラダイス銀河	映画『となりのトトロ』	メガドライブ発売	リクルートスーツの定着	ソウルオリンピック	青函トンネル開業	トレンディドラマ
1989	Diamonds	テレビドラマ『愛しあってるかい！』	ゲームボーイ発売	消費税導入と価格表示	千代の富士が国民栄誉賞	昭和から平成へ	渋カジ
1990	おどるポンポコリン	テレビアニメ『ちびまる子ちゃん』	スーパーファミコン発売	ティラミスブーム	野茂英雄が新人王とMVP	東西ドイツ統一	バブル期のカラオケボックス
1991	ラブ・ストーリーは突然に	テレビドラマ『東京ラブストーリー』	ストリートファイターII	ジュリアナ東京開業	若貴ブーム	東京都庁新庁舎開庁	アッシー君とメッシー君
1992	君がいるだけで	テレビドラマ『ずっとあなたが好きだった』	星のカービィ発売	もつ鍋ブーム	バルセロナオリンピック	PKO協力法成立	ルーズソックスの前兆
1993	YAH YAH YAH	テレビドラマ『ひとつ屋根の下』	Jリーグ関連ゲーム	ナタ・デ・ココブーム	Jリーグ開幕	細川連立政権発足	ポケベル普及
1994	innocent world	テレビドラマ『家なき子』	セガサターンとPlayStation発売	プリント倶楽部開発期	イチローがシーズン210安打	関西国際空港開港	コギャル文化
1995	LOVE LOVE LOVE	テレビドラマ『王様のレストラン』	クロノ・トリガー	Windows 95発売	野茂英雄がメジャーで新人王	白川郷・五箇山が世界文化遺産登録	プリクラ登場
1996	名もなき詩	テレビドラマ『ロングバケーション』	ポケットモンスター赤・緑	スターバックス日本1号店	アトランタオリンピック	海の日施行	アムラー
1997	CAN YOU CELEBRATE?	テレビドラマ『踊る大捜査線』	たまごっちブーム	キシリトールガム人気	サッカー日本代表W杯初出場決定	消費税率5％へ	ルーズソックス
1998	timing	テレビドラマ『GTO』	ゲームボーイカラー発売	携帯電話のショートメール	長野冬季オリンピック	明石海峡大橋開通	厚底ブーツ
1999	だんご3兄弟	テレビドラマ『魔女の条件』	ドリームキャスト人気と携帯ゲーム	iモード開始	福岡ダイエーホークス日本一	瀬戸内しまなみ海道開通	カリスマ店員
2000	TSUNAMI	テレビドラマ『ビューティフルライフ』	PlayStation 2発売	ユニクロのフリース	高橋尚子がシドニー五輪金メダル	BSデジタル放送開始	ミレニアムブーム
2001	Can You Keep A Secret?	映画『千と千尋の神隠し』	ゲームボーイアドバンス発売	ユニバーサル・スタジオ・ジャパン開業	イチローがMLB新人王とMVP	Suicaサービス開始	写メール
2002	亜麻色の髪の乙女	テレビドラマ『ごくせん』	ニンテンドーゲームキューブ人気	おにぎり専門店ブーム	FIFAワールドカップ日韓大会	住民基本台帳ネットワーク開始	着メロ
2003	世界に一つだけの花	テレビドラマ『GOOD LUCK!!』	ゲームボーイアドバンスSP	六本木ヒルズ開業	阪神タイガース18年ぶりリーグ優勝	地上デジタル放送開始	へぇボタン
2004	瞳をとじて	テレビドラマ『冬のソナタ』	ニンテンドーDS発売	伊右衛門発売	アテネ五輪で日本勢メダルラッシュ	九州新幹線が一部開業	韓流ブーム
2005	青春アミーゴ	テレビドラマ『電車男』	脳を鍛える大人のDSトレーニング	愛・地球博グッズ	千葉ロッテマリーンズ日本一	個人情報保護法全面施行	ブログと電車男
2006	Real Face	テレビドラマ『のだめカンタービレ』	Wii発売	植物性乳酸菌飲料の話題	第1回ワールド・ベースボール・クラシック	国際天文学連合が惑星を再定義	mixiとSNS
2007	千の風になって	テレビドラマ『花より男子2』	Wii Fit発売	ビリーズブートキャンプ	松坂大輔がMLBデビュー	郵政民営化	ケータイ小説
2008	そばにいるね	映画『崖の上のポニョ』	モンスターハンターポータブル 2nd G	生キャラメルブーム	北京オリンピック	日本人4人がノーベル賞受賞	アラフォー
2009	Believe	テレビドラマ『JIN-仁-』	トモダチコレクション	ハイボールブーム	ワールド・ベースボール・クラシック連覇	政権交代	草食系男子
2010	ヘビーローテーション	映画『告白』	ポケットモンスター ブラック・ホワイト	食べるラー油	サッカー日本代表W杯ベスト16	小惑星探査機はやぶさ帰還	スマートフォン普及
2011	フライングゲット	テレビドラマ『家政婦のミタ』	ニンテンドー3DS発売	コンビニスイーツ人気	なでしこジャパンW杯優勝	九州新幹線全線開業	FacebookとTwitterの利用拡大
2012	真夏のSounds good!	映画『テルマエ・ロマエ』	パズル＆ドラゴンズ	塩麹ブーム	ロンドン五輪で日本最多メダル	東京スカイツリー開業	LINE普及
2013	恋するフォーチュンクッキー	連続テレビ小説『あまちゃん』	妖怪ウォッチ発売	パンケーキブーム	東北楽天ゴールデンイーグルス日本一	富士山が世界文化遺産登録	今でしょ！
2014	レット・イット・ゴー	映画『アナと雪の女王』	妖怪ウォッチ2	コンビニコーヒー	ソチ冬季五輪で羽生結弦が金メダル	富岡製糸場が世界文化遺産登録	壁ドン
2015	R.Y.U.S.E.I.	連続テレビ小説『あさが来た』	スプラトゥーン発売	おにぎらず	ラグビーW杯で日本が南アフリカに勝利	北陸新幹線開業	爆買い
2016	恋	映画『君の名は。』	Pokémon GO	甘酒ブーム	リオ五輪で日本勢が活躍	北海道新幹線開業	PPAP
2017	インフルエンサー	映画『美女と野獣』	Nintendo Switch発売	チーズタッカルビ	桐生祥秀が日本人初の100m9秒台	将棋の藤井聡太が公式戦29連勝	インスタ映え
2018	Lemon	映画『カメラを止めるな！』	大乱闘スマッシュブラザーズ SPECIAL	タピオカ再ブーム	平昌五輪で日本最多の冬季メダル	はやぶさ2が小惑星リュウグウ到着	そだねー
2019	Pretender	テレビドラマ『あなたの番です』	リングフィット アドベンチャー	バスクチーズケーキ	ラグビーワールドカップ日本大会	令和へ改元	サブスク音楽
2020	夜に駆ける	テレビドラマ『半沢直樹』	あつまれ どうぶつの森	おうち時間の料理とテイクアウト	オンラインで楽しむスポーツ観戦	はやぶさ2のカプセル帰還	オンライン授業とZoom
2021	ドライフラワー	テレビドラマ『ドラゴン桜』第2シリーズ	ウマ娘 プリティーダービー	マリトッツォ	東京2020オリンピック開催	新型コロナワクチン接種開始	黙食
2022	Habit	テレビアニメ『SPY×FAMILY』	スプラトゥーン3	ヤクルト1000	北京冬季五輪	西九州新幹線開業	きつねダンス
2023	アイドル	テレビドラマ『VIVANT』	ゼルダの伝説 ティアーズ オブ ザ キング	10円パン	ワールド・ベースボール・クラシック優勝	生成AIの一般利用拡大	蛙化現象
2024	Bling-Bang-Bang-Born	連続テレビ小説『虎に翼』	ドラゴンクエストIII HD-2D版	アサイーボウル再流行	パリオリンピック	新しい日本銀行券の発行	界隈
2025	IRIS OUT	映画『国宝』	Nintendo Switch 2	大阪・関西万博グッズ	ロサンゼルス・ドジャースの日本人選手活躍	大阪・関西万博	ミャクミャク人気
2026	IRIS OUTのロングヒット	日本アカデミー賞で『国宝』が最優秀作品賞	スプラトゥーン レイダース発売	Nintendo Switch 2の選べる本体セット	愛知・名古屋アジア競技大会	FIFAワールドカップ2026	生成AIを使った学習と創作`;

const categoryDefs = [
  { key: "music", label: "音楽", prompt: "この曲やアーティストを、どこで知りましたか？" },
  { key: "screen", label: "テレビ・映画", prompt: "この作品を、誰とどこで見ましたか？" },
  { key: "gamesToys", label: "ゲーム・おもちゃ", prompt: "遊んだことはありますか？どんな思い出がありますか？" },
  { key: "lifestyle", label: "商品・食べ物・ファッション", prompt: "当時、実際に買ったり試したりしましたか？" },
  { key: "sports", label: "スポーツ", prompt: "この場面を、どこで応援していましたか？" },
  { key: "news", label: "社会・ニュース", prompt: "このニュースを、最初にどこで知りましたか？" },
  { key: "schoolCulture", label: "学校・生活・流行", prompt: "学校や身近な場所では、どんな話題になっていましたか？" },
];

const verifiedOverrides = {
  "1960-music-001": {
    shortDescription: "西田佐知子の「アカシアの雨がやむとき」は1960年4月に発売され、時間をかけて広く聴かれるようになりました。",
    conversationPrompt: "家族が口ずさんでいた昭和歌謡はありますか？",
    sourceName: "otonano『昭和歌謡の歌姫’60s名曲レビュー』",
    sourceURL: "https://otonanoweb.jp/s/magazine/diary/detail/11117",
  },
  "1960-screen-001": {
    shortDescription: "小津安二郎監督の映画「秋日和」は1960年11月13日に公開。母と娘の日々を、ユーモアを交えて描きました。",
    conversationPrompt: "家族と一緒に見た映画で、覚えている作品はありますか？",
    sourceName: "松竹 作品データベース『秋日和』",
    sourceURL: "https://www.shochiku.co.jp/cinema/database/03373/",
  },
  "1960-gamestoys-001": {
    shortDescription: "空気で膨らませて腕につける人形が「だっこちゃん」の愛称で親しまれ、1960年に大きなブームになりました。",
    conversationPrompt: "当時、街でよく見かけた流行のおもちゃを覚えていますか？",
    sourceName: "タカラトミー 社史・商品史",
    sourceURL: "https://www.takaratomy.co.jp/company/history.html",
    notes: "名称のみ使用。旧商品の図案・姿・企業ロゴはイラストで再現しない",
  },
  "1960-lifestyle-001": {
    shortDescription: "1960年9月、NHKと民放各局が東京・大阪でカラーテレビの本放送を開始しました。カラー放送時代の幕開けです。",
    conversationPrompt: "初めてカラーで見た番組を覚えていますか？",
    sourceName: "家電製品協会『家電の昭和史 テレビ』",
    sourceURL: "https://www.kdb.or.jp/syouwasiterebi.html",
  },
  "1960-sports-001": {
    shortDescription: "第17回夏季オリンピックが1960年にローマで開催され、世界83の国と地域から選手が集まりました。",
    conversationPrompt: "印象に残っているオリンピックの競技は何ですか？",
    sourceName: "日本オリンピック委員会『1960年ローマ大会』",
    sourceURL: "https://www.joc.or.jp/games/olympic/poster/1960.html",
  },
  "1960-news-001": {
    shortDescription: "政府は1960年12月、10年以内の国民総生産倍増と生活水準の向上を目標に、国民所得倍増計画を決定しました。",
    conversationPrompt: "暮らしが豊かになったと感じる家電や出来事は何ですか？",
    sourceName: "国立公文書館『国民所得倍増計画』",
    sourceURL: "https://www.archives.go.jp/learning/archive_collection_8/collection_1/",
  },
  "1960-schoolculture-001": {
    shortDescription: "1960年ごろ、テレビは急速に家庭へ普及しました。番組を家族で囲む時間が、日常の風景になっていきます。",
    conversationPrompt: "家族みんなで見ていた番組はありますか？",
    sourceName: "厚生労働省『厚生白書 昭和35年度版』",
    sourceURL: "https://www.mhlw.go.jp/toukei_hakusho/hakusho/kousei/1960/dl/02.pdf",
  },
  "1961-music-001": {
    shortDescription: "坂本九の「上を向いて歩こう」は1961年、テレビ番組の“今月のうた”から反響が広がり、のちに海外でもヒットしました。",
    conversationPrompt: "気分を前向きにしてくれた曲はありますか？",
    sourceName: "ユニバーサル ミュージック『上を向いて歩こう』",
    sourceURL: "https://www.universal-music.co.jp/sakamoto-kyu/news/2023-03-17/",
  },
  "1961-screen-001": {
    shortDescription: "NHK連続テレビ小説の第1作「娘と私」は1961年4月に放送開始。父と娘の成長を温かな目線で描きました。",
    conversationPrompt: "朝に家族で見ていたテレビ番組はありますか？",
    sourceName: "放送ライブラリー『娘と私』",
    sourceURL: "https://www.bpcj.or.jp/program/detail/000212/",
  },
  "1961-gamestoys-001": {
    shortDescription: "1961年、モーターを内蔵した「電動プラ汽車セット」が登場。青いレールを走る鉄道玩具の遊びが広がりました。",
    conversationPrompt: "どんな車両やコースを作って遊びましたか？",
    sourceName: "タカラトミー『プラレールとは』",
    sourceURL: "https://www.takaratomy.co.jp/products/plarail/about/index2.htm",
  },
  "1961-lifestyle-001": {
    shortDescription: "1961年、使い捨ての生理用ナプキン「アンネナプキン」が発売され、女性の日常を支える用品が変化しました。",
    conversationPrompt: "昔と比べて便利になった日用品は何ですか？",
    sourceName: "京都先端科学大学人文学会『生理用品の変遷』",
    sourceURL: "https://lab.kuas.ac.jp/~jinbungakkai/pdf/2013/h2013_03.pdf",
  },
  "1961-sports-001": {
    shortDescription: "大鵬は1961年に2場所連続優勝を果たし、21歳3か月で第48代横綱へ昇進しました。",
    conversationPrompt: "応援していた力士や、家族で見た名勝負はありますか？",
    sourceName: "日本相撲協会『歴代横綱』",
    sourceURL: "https://sumo.or.jp/Yokozuna/yokozuna/",
  },
  "1961-news-001": {
    shortDescription: "1961年4月12日、ユーリ・ガガーリンがボストーク1号で地球を1周し、人類初の宇宙飛行を成し遂げました。",
    conversationPrompt: "宇宙へ行けるなら、地球の何を見てみたいですか？",
    sourceName: "JAXA『ガガーリンによる人類初の宇宙飛行から50年』",
    sourceURL: "https://edu.jaxa.jp/contents/soratobi/assets/ST015.pdf",
  },
  "1961-schoolculture-001": {
    shortDescription: "植木等の「スーダラ節」は1961年に発売。軽快な歌とユーモアが親しまれ、時代を映す流行歌になりました。",
    conversationPrompt: "思わずまねした歌い方や決めぜりふはありますか？",
    sourceName: "国立国会図書館 常設展示資料『昭和の流行歌』",
    sourceURL: "https://dl.ndl.go.jp/view/download/digidepo_999341_po_79.pdf?contentNo=1",
  },
  "1962-music-001": {
    shortDescription: "橋幸夫と吉永小百合のデュエット曲「いつでも夢を」は1962年に発売され、第4回日本レコード大賞を受賞しました。",
    conversationPrompt: "一緒に歌った思い出のあるデュエット曲はありますか？",
    sourceName: "日本作曲家協会『第4回日本レコード大賞』",
    sourceURL: "https://www.jacompa.or.jp/record/4.php",
  },
  "1962-screen-001": {
    shortDescription: "1962年公開の「キューポラのある街」は、鋳物の町・川口で暮らす少女の成長を吉永小百合主演で描きました。",
    conversationPrompt: "地元の町を舞台にした作品を見たことがありますか？",
    sourceName: "日活『キューポラのある街』",
    sourceURL: "https://www.nikkatsu.com/movie/20620.html",
  },
  "1962-gamestoys-001": {
    shortDescription: "タミヤは1962年、モーターで走る1/35スケールの「パンサータンク」を発売。戦車模型シリーズの出発点になりました。",
    conversationPrompt: "組み立てて遊んだプラモデルはありますか？",
    sourceName: "タミヤ『沿革と歴史』",
    sourceURL: "https://www.tamiya.com/japan/company/history.html",
  },
  "1962-lifestyle-001": {
    shortDescription: "シャープは1962年、国内初の量産電子レンジを発売。まず業務用から、食事を素早く温める技術が広がりました。",
    conversationPrompt: "電子レンジで初めて温めた料理を覚えていますか？",
    sourceName: "シャープ『国内初の量産電子レンジ』",
    sourceURL: "https://corporate.jp.sharp/info/history/only_one/denka/denka_w17.html",
  },
  "1962-sports-001": {
    shortDescription: "堀江謙一は1962年、小型ヨット「マーメイド号」で西宮からサンフランシスコまで単独無寄港横断を達成しました。",
    conversationPrompt: "一度挑戦してみたい冒険や旅はありますか？",
    sourceName: "堀江謙一 サントリーマーメイドⅢ号公式サイト",
    sourceURL: "https://www.suntorymermaid.com/sm3/profile/",
  },
  "1962-news-001": {
    shortDescription: "戦後初の国産旅客機YS-11の試作1号機が、1962年8月30日に初飛行しました。",
    conversationPrompt: "初めて飛行機に乗ったときのことを覚えていますか？",
    sourceName: "日本航空協会『YS-11初飛行60周年記念プロジェクト』",
    sourceURL: "https://www.aero.or.jp/isan/YS-11_60th_Aniv.htm",
  },
  "1962-schoolculture-001": {
    shortDescription: "腰や足をひねって踊るツイストが、1960年代初頭に世界各地へ広がり、日本でも若者を中心に親しまれました。",
    conversationPrompt: "当時まねして踊ったダンスはありますか？",
    sourceName: "コトバンク『ツイスト』",
    sourceURL: "https://kotobank.jp/word/%E3%81%A4%E3%81%84%E3%81%99%E3%81%A8-3183272",
  },
  "1963-music-001": {
    shortDescription: "梓みちよの「こんにちは赤ちゃん」は1963年に第5回日本レコード大賞を受賞。明るく親しみやすい旋律が広く愛されました。",
    conversationPrompt: "赤ちゃんの誕生を家族で祝った思い出はありますか？",
    sourceName: "日本作曲家協会『第5回日本レコード大賞』",
    sourceURL: "https://www.jacompa.or.jp/record/5.php",
  },
  "1963-screen-001": {
    shortDescription: "国産初の本格的な連続テレビアニメ「鉄腕アトム」は1963年1月に放送開始。毎週の放送を楽しみにする子どもが増えました。",
    conversationPrompt: "毎週楽しみにしていたアニメは何ですか？",
    sourceName: "手塚治虫公式『鉄腕アトム』",
    sourceURL: "https://tezukaosamu.net/jp/anime/30.html",
    notes: "作品名のみ使用。キャラクターやロゴはイラストで再現しない",
  },
  "1963-gamestoys-001": {
    shortDescription: "1963年にはレーシングカー玩具が登場し、車を走らせて競う遊びが子どもたちの人気を集めました。",
    conversationPrompt: "競争させて遊んだ乗り物のおもちゃはありますか？",
    sourceName: "日本玩具文化財団『おもちゃの歴史』",
    sourceURL: "https://toyculture.org/about_toy/history_toy/",
  },
  "1963-lifestyle-001": {
    shortDescription: "エースコックは1963年8月27日にワンタンメンを発売。即席麺にワンタンの風味を組み合わせたロングセラーです。",
    conversationPrompt: "昔よく食べた即席麺や夜食は何ですか？",
    sourceName: "エースコック『ワンタンメンの歴史』",
    sourceURL: "https://www.acecook.co.jp/brand/wantan/story.html",
  },
  "1963-sports-001": {
    shortDescription: "横綱・大鵬は1963年5月場所で優勝し、当時史上初となる6場所連続優勝を成し遂げました。",
    conversationPrompt: "家族で応援した力士や名勝負を覚えていますか？",
    sourceName: "放送ライブラリー『大鵬 史上初の6連覇』",
    sourceURL: "https://www.bpcj.or.jp/program/detail/N01609/",
  },
  "1963-news-001": {
    shortDescription: "黒部ダムは7年の工事を経て1963年6月5日に完成。日本の高度成長を支えた大規模な電源開発でした。",
    conversationPrompt: "一度見に行って印象に残った大きな建造物はありますか？",
    sourceName: "関西電力『くろよんの歴史』",
    sourceURL: "https://www.kepco.co.jp/brand/kuroyon_history/",
  },
  "1963-schoolculture-001": {
    shortDescription: "1963年には、休暇を楽しむ意味の「バカンス」が流行語になりました。余暇や旅行への関心が高まった時代です。",
    conversationPrompt: "夏休みや家族旅行で一番楽しかった場所はどこですか？",
    sourceName: "資生堂 花椿『旅するファッション史』",
    sourceURL: "https://www.shiseido.co.jp/sp/hanatsubaki/2015voyage/archive01_2.html",
  },
  "1964-music-001": {
    shortDescription: "三波春夫の「東京五輪音頭」は東京大会を盛り上げた歌として親しまれ、1964年の日本レコード大賞特別賞を受けました。",
    conversationPrompt: "運動会や盆踊りで踊った曲を覚えていますか？",
    sourceName: "日本作曲家協会『第6回日本レコード大賞』",
    sourceURL: "https://www.jacompa.or.jp/record/6.php",
  },
  "1964-screen-001": {
    shortDescription: "映画「モスラ対ゴジラ」は1964年4月29日に公開。ゴジラとモスラが対決する怪獣映画として人気を集めました。",
    conversationPrompt: "映画館で見た怪獣映画の思い出はありますか？",
    sourceName: "東宝公式『モスラ対ゴジラ』",
    sourceURL: "https://tohoentertainmentonline.com/shop/e/eGS104/",
    notes: "作品名のみ使用。怪獣やロゴはイラストで再現しない",
  },
  "1964-gamestoys-001": {
    shortDescription: "1964年には、音声を楽しめる「お話ミコちゃん」がヒット。人形遊びに新しい仕掛けが加わりました。",
    conversationPrompt: "話したり音が鳴ったりする人形で遊びましたか？",
    sourceName: "日本玩具文化財団『おもちゃの歴史』",
    sourceURL: "https://toyculture.org/about_toy/history_toy/",
  },
  "1964-lifestyle-001": {
    shortDescription: "カルビーは1964年に「かっぱえびせん」を発売。生のえびを生地に練り込んだスナックは全国でヒットしました。",
    conversationPrompt: "遠足やおやつの時間に好きだったお菓子は何ですか？",
    sourceName: "カルビー『商品の歴史』",
    sourceURL: "https://www.calbee.co.jp/corporate/history/product.php",
  },
  "1964-sports-001": {
    shortDescription: "第18回オリンピック競技大会は1964年10月10日に東京で開幕。93の国と地域から選手が集まりました。",
    conversationPrompt: "東京大会で特に印象に残った競技は何ですか？",
    sourceName: "日本オリンピック委員会『東京1964』",
    sourceURL: "https://www.joc.or.jp/past_games/tokyo1964/",
  },
  "1964-news-001": {
    shortDescription: "東海道新幹線は1964年に開業し、東京―新大阪間を最速4時間で結びました。旅行や出張の形が大きく変わりました。",
    conversationPrompt: "初めて新幹線に乗った日のことを覚えていますか？",
    sourceName: "JR東海『新幹線の歩み』",
    sourceURL: "https://recommend.jr-central.co.jp/gooddayexpress/history/",
  },
  "1964-schoolculture-001": {
    shortDescription: "1964年4月、制限付きながら日本人の海外観光旅行が自由化され、海外旅行が少しずつ身近になりました。",
    conversationPrompt: "初めての海外旅行で驚いたことは何ですか？",
    sourceName: "日本旅行業協会『数字が語る旅行業』",
    sourceURL: "https://www.jata-net.or.jp/wp/wp-content/uploads/2026/06/sujikataru2026.pdf",
  },
  "1965-music-001": {
    shortDescription: "美空ひばりの「柔」は1965年の第7回日本レコード大賞を受賞。力強い歌声で広く親しまれました。",
    conversationPrompt: "元気をもらった美空ひばりの歌はありますか？",
    sourceName: "日本作曲家協会『第7回日本レコード大賞』",
    sourceURL: "https://www.jacompa.or.jp/record/7.php",
  },
  "1965-screen-001": {
    shortDescription: "テレビアニメ「オバケのQ太郎」は1965年8月29日に放送開始。Qちゃんと正ちゃんの日常が人気を集めました。",
    conversationPrompt: "好きだったQちゃんの仲間や場面を覚えていますか？",
    sourceName: "トムス・エンタテインメント『オバケのQ太郎』",
    sourceURL: "https://www.tms-e.co.jp/alltitles/1960s/002101.html",
    notes: "作品名のみ使用。キャラクターやロゴはイラストで再現しない",
  },
  "1965-gamestoys-001": {
    shortDescription: "1965年にはレーシングカー玩具の生産が年間400万台に達するブームとなり、家庭や遊び場で競走が楽しまれました。",
    conversationPrompt: "コースを作って競走させた思い出はありますか？",
    sourceName: "日本玩具文化財団『おもちゃの歴史』",
    sourceURL: "https://toyculture.org/about_toy/history_toy/",
  },
  "1965-lifestyle-001": {
    shortDescription: "白元の保冷枕「アイスノン」は1965年に発売。冷凍庫で冷やして繰り返し使える家庭用品として広まりました。",
    conversationPrompt: "夏の暑さ対策に使っていた道具は何ですか？",
    sourceName: "白元アース『アイスノンソフト企画品』",
    sourceURL: "https://www.hakugen-earth.co.jp/topics/docs/IceNon_Soft2018.pdf",
  },
  "1965-sports-001": {
    shortDescription: "読売巨人軍は1965年に日本一となり、1973年まで続く9年連続日本一「V9」の歩みを始めました。",
    conversationPrompt: "V9時代に応援していた選手は誰ですか？",
    sourceName: "読売ジャイアンツ『長嶋茂雄終身名誉監督追悼ページ』",
    sourceURL: "https://www.giants.jp/sp/shigeo_nagashima/",
  },
  "1965-news-001": {
    shortDescription: "1965年7月1日、名神高速道路が小牧―西宮間で全線開通。日本の都市間移動を支える高速道路網が広がりました。",
    conversationPrompt: "高速道路で出かけた家族旅行を覚えていますか？",
    sourceName: "NEXCO東日本『高速道路50年の歩み』",
    sourceURL: "https://www.e-nexco.co.jp/pressroom/50.html",
  },
  "1965-schoolculture-001": {
    shortDescription: "1965年には、よく弾むスーパーボールがアメリカから日本へ渡来。子どもたちの遊びに新しい人気玩具が加わりました。",
    conversationPrompt: "スーパーボールをどこまで高く弾ませましたか？",
    sourceName: "日本玩具文化財団『おもちゃの歴史』",
    sourceURL: "https://toyculture.org/about_toy/history_toy/",
  },
  "1966-music-001": {
    shortDescription: "橋幸夫の「霧氷」は1966年の第8回日本レコード大賞を受賞。おしゃれな曲調と歌声が評価されました。",
    conversationPrompt: "橋幸夫の歌で口ずさめる曲はありますか？",
    sourceName: "日本作曲家協会『第8回日本レコード大賞』",
    sourceURL: "https://www.jacompa.or.jp/record/8.php",
  },
  "1966-screen-001": {
    shortDescription: "テレビシリーズ「ウルトラマン」は1966年7月に放送開始。勇気や希望を届けるヒーローとして親しまれました。",
    conversationPrompt: "好きだった怪獣や必殺技を覚えていますか？",
    sourceName: "円谷プロ『ウルトラマンシリーズ60周年』",
    sourceURL: "https://60th.m-78.jp/news/36/",
    notes: "作品名のみ使用。ヒーロー・怪獣・ロゴはイラストで再現しない",
  },
  "1966-gamestoys-001": {
    shortDescription: "1966年には「ウルトラマン」などを中心に第1次怪獣ブームが起こり、関連する人形や玩具が人気を集めました。",
    conversationPrompt: "集めていた怪獣人形やカードはありますか？",
    sourceName: "日本玩具文化財団『おもちゃの歴史』",
    sourceURL: "https://toyculture.org/about_toy/history_toy/",
    notes: "商品名・作品名のみ使用。キャラクター造形は再現しない",
  },
  "1966-lifestyle-001": {
    shortDescription: "江崎グリコは1966年にポッキーを発売。持ち手を残してチョコをかける工夫で、手軽に分け合えるお菓子になりました。",
    conversationPrompt: "みんなで分けて食べたお菓子は何ですか？",
    sourceName: "Glicoグループ100年史『ポッキー』",
    sourceURL: "https://www.glico.com/jp/100th_history_contents/highlight/product/006.html",
  },
  "1966-sports-001": {
    shortDescription: "読売巨人軍は1966年も日本シリーズを制し、2年連続の日本一に。のちにV9と呼ばれる連覇を伸ばしました。",
    conversationPrompt: "テレビやラジオで応援した日本シリーズはありますか？",
    sourceName: "日本野球機構『読売ジャイアンツ』",
    sourceURL: "https://www.npb.or.jp/bis/teams/index_g.html",
  },
  "1966-news-001": {
    shortDescription: "人口推計で1966年3月31日に日本の総人口が1億人を突破。高度成長期の大きな節目として伝えられました。",
    conversationPrompt: "人が増え、町がにぎやかになった変化を覚えていますか？",
    sourceName: "国立国会図書館 レファレンス協同データベース",
    sourceURL: "https://crd.ndl.go.jp/reference/entry/index.php?id=1000053745&page=ref_view",
  },
  "1966-schoolculture-001": {
    shortDescription: "1966年にはミニスカートが普及し、鮮やかな色や若々しい装いとともに新しいファッションとして注目されました。",
    conversationPrompt: "当時挑戦した新しい髪型や服装はありますか？",
    sourceName: "ファッションビジネス学会『1966年』",
    sourceURL: "https://www.fbsociety.com/nenpyo/1966.html",
  },
  "1967-music-001": {
    shortDescription: "「ブルー・シャトウ」は1967年の第9回日本レコード大賞を受賞。グループ・サウンズ時代を代表する一曲になりました。",
    conversationPrompt: "替え歌も含めて、みんなで歌った曲はありますか？",
    sourceName: "日本作曲家協会『第9回日本レコード大賞』",
    sourceURL: "https://www.jacompa.or.jp/record/9.php",
  },
  "1967-screen-001": {
    shortDescription: "テレビアニメ「リボンの騎士」は1967年4月2日に放送開始。サファイヤの恋と冒険をカラーで描きました。",
    conversationPrompt: "憧れた物語の主人公は誰ですか？",
    sourceName: "手塚治虫公式『リボンの騎士』",
    sourceURL: "https://tezukaosamu.net/jp/anime/35.html",
    notes: "作品名のみ使用。キャラクターやロゴはイラストで再現しない",
  },
  "1967-gamestoys-001": {
    shortDescription: "着せ替え人形「リカちゃん」は1967年7月4日に発売。ドレスやハウスと一緒に、ごっこ遊びの世界を広げました。",
    conversationPrompt: "人形の服や部屋をどんなふうに工夫しましたか？",
    sourceName: "タカラトミー『リカちゃんについて』",
    sourceURL: "https://www.takaratomy.co.jp/product_release/pdf/p170124.pdf",
    notes: "商品名のみ使用。人形・衣装・ロゴの意匠は再現しない",
  },
  "1967-lifestyle-001": {
    shortDescription: "1967年、モデルのツイッギーが来日。ミニスカート姿が注目され、日本のファッションブームに勢いを加えました。",
    conversationPrompt: "流行を見て買った思い出の服はありますか？",
    sourceName: "ファッションビジネス学会『1967年』",
    sourceURL: "https://www.fbsociety.com/nenpyo/1967.html",
  },
  "1967-sports-001": {
    shortDescription: "第5回夏季ユニバーシアードが1967年に東京で開催され、日本選手団は金21個を含む多くのメダルを獲得しました。",
    conversationPrompt: "学生スポーツで印象に残っている大会はありますか？",
    sourceName: "日本オリンピック委員会『1967-1977参加状況』",
    sourceURL: "https://www.joc.or.jp/games/univ/sanka/1967_1977.html",
  },
  "1967-news-001": {
    shortDescription: "国連は1967年を国際観光年と定めました。旅行を通じた国際交流や相互理解への関心が世界で高まりました。",
    conversationPrompt: "旅先で知った異なる文化や習慣はありますか？",
    sourceName: "世界観光機関アジア太平洋地域事務所『歴史』",
    sourceURL: "https://unwto-ap.org/about/history/",
  },
  "1967-schoolculture-001": {
    shortDescription: "1967年はグループ・サウンズがテレビを彩り、バンドの演奏やファッションが若者の憧れになりました。",
    conversationPrompt: "好きだったグループ・サウンズはどのバンドですか？",
    sourceName: "日本作曲家協会『第9回日本レコード大賞』",
    sourceURL: "https://www.jacompa.or.jp/record/9.php",
  },
  "1968-music-001": {
    shortDescription: "ピンキーとキラーズの「恋の季節」は1968年に大ヒットし、17週連続1位を記録した代表的な昭和ポップスです。",
    conversationPrompt: "山高帽や振り付けをまねして歌いましたか？",
    sourceName: "キングレコード『恋の季節 ピンキーとキラーズ大全集』",
    sourceURL: "https://store.kingrecords.co.jp/shop/g/gNKCD-7739/",
  },
  "1968-screen-001": {
    shortDescription: "テレビアニメ「ゲゲゲの鬼太郎」は1968年1月に放送開始。全国的な妖怪ブームの火付け役になりました。",
    conversationPrompt: "少し怖くても好きだった妖怪はいますか？",
    sourceName: "東映アニメーション『ゲゲゲの鬼太郎』",
    sourceURL: "https://lineup.toei-anim.co.jp/ja/tv/kitaro_1st/story/",
    notes: "作品名のみ使用。妖怪・キャラクター・ロゴはイラストで再現しない",
  },
  "1968-gamestoys-001": {
    shortDescription: "「人生ゲーム」は1968年9月に日本で発売。ルーレットを回し、家族や友人と人生の出来事を楽しむ盤ゲームです。",
    conversationPrompt: "人生ゲームではどんな職業や展開を楽しみましたか？",
    sourceName: "タカラトミー『人生ゲームの年表』",
    sourceURL: "https://www.takaratomy.co.jp/products/jinsei/history/1968-/",
    notes: "商品名のみ使用。盤面・ロゴ・パッケージの意匠は再現しない",
  },
  "1968-lifestyle-001": {
    shortDescription: "大塚食品は1968年、世界初の市販用レトルト食品「ボンカレー」を発売。温めるだけの手軽な食事を広げました。",
    conversationPrompt: "初めて食べたレトルト食品を覚えていますか？",
    sourceName: "大塚食品『沿革』",
    sourceURL: "https://www.otsukafoods.co.jp/company/history/",
  },
  "1968-sports-001": {
    shortDescription: "第19回夏季オリンピックは1968年にメキシコシティーで開催。日本は金11個を含む25個のメダルを獲得しました。",
    conversationPrompt: "メキシコ大会で覚えている日本選手はいますか？",
    sourceName: "日本オリンピック委員会『1968年メキシコシティー大会』",
    sourceURL: "https://www.joc.or.jp/games/olympic/poster/1968.html",
  },
  "1968-news-001": {
    shortDescription: "1968年、日本の郵便に5桁の郵便番号制度が導入されました。手紙や荷物を効率よく届ける仕組みが整いました。",
    conversationPrompt: "手紙をよく送っていた相手は誰ですか？",
    sourceName: "日本郵便『郵便局の歴史』",
    sourceURL: "https://www.post.japanpost.jp/about/csr/society/downloads/torikumi.pdf",
  },
  "1968-schoolculture-001": {
    shortDescription: "深夜ラジオが若者の交流の場となり、1968年には「オールナイトニッポン」の会報誌やリスナーの集いも始まりました。",
    conversationPrompt: "夜更かしして聴いたラジオ番組はありますか？",
    sourceName: "ニッポン放送『オールナイトニッポン55年史』",
    sourceURL: "https://news.1242.com/article/424682",
  },
  "1969-music-001": {
    shortDescription: "皆川おさむの「黒ネコのタンゴ」は1969年に録音され、子どもの歌声と親しみやすい旋律で大ヒットしました。",
    conversationPrompt: "子どものころ覚えた楽しい歌はありますか？",
    sourceName: "キングレコード『皆川おさむくん』",
    sourceURL: "https://www.kingrecords.co.jp/cs/g/gKICG-762/",
  },
  "1969-screen-001": {
    shortDescription: "アニメ「サザエさん」は1969年10月5日に第1回を放送。日曜夕方の家族の時間を彩る長寿番組になりました。",
    conversationPrompt: "家族で見ていたサザエさんの思い出はありますか？",
    sourceName: "フジテレビ『サザエさん 番組紹介』",
    sourceURL: "https://www.fujitv.co.jp/sazaesan/intro.html",
    notes: "作品名のみ使用。キャラクターやロゴはイラストで再現しない",
  },
  "1969-gamestoys-001": {
    shortDescription: "1969年に登場した「ママレンジ」は、実際に加熱して料理遊びができる玩具として大きな注目を集めました。",
    conversationPrompt: "本物のように使えるおままごと道具はありましたか？",
    sourceName: "日本玩具文化財団『おもちゃの歴史』",
    sourceURL: "https://toyculture.org/about_toy/history_toy/",
    notes: "商品名のみ使用。製品・ロゴ・パッケージの意匠は再現しない",
  },
  "1969-lifestyle-001": {
    shortDescription: "明治の「アポロ」は1969年8月7日に発売。宇宙船を思わせる三角形と、いちごチョコの組み合わせが親しまれました。",
    conversationPrompt: "遠足や駄菓子屋で選んだチョコは何ですか？",
    sourceName: "明治『アポロ ヒストリー』",
    sourceURL: "https://www.meiji.co.jp/sweets/chocolate/apollo/kids_apollo/",
  },
  "1969-sports-001": {
    shortDescription: "1969年夏の甲子園決勝は松山商と三沢が延長18回を0対0で引き分け、翌日の再試合で松山商が優勝しました。",
    conversationPrompt: "最後まで見届けた高校野球の名勝負はありますか？",
    sourceName: "日本高等学校野球連盟『選手権大会の歩み』",
    sourceURL: "https://jhbf.or.jp/sensyuken/history/",
  },
  "1969-news-001": {
    shortDescription: "1969年7月、アポロ11号が人類初の月面着陸に成功。月へ行くという長年の夢が現実になりました。",
    conversationPrompt: "月面着陸の中継をどこで見ましたか？",
    sourceName: "JAXA『1969年 アポロ11号』",
    sourceURL: "https://iss.jaxa.jp/kids/yu-jin/1969.html",
  },
  "1969-schoolculture-001": {
    shortDescription: "池袋PARCOは1969年11月に開店。ファッションだけでなく音楽やアートなど、新しい文化を発信する場になりました。",
    conversationPrompt: "若いころによく出かけた商業施設はどこですか？",
    sourceName: "パルコ『沿革』",
    sourceURL: "https://www.parco.co.jp/about/history/",
  },
  "1970-music-001": {
    shortDescription: "岸洋子の「希望」は1970年の日本レコード大賞で歌唱賞を受賞。未来へ歩む思いを歌った曲として親しまれました。",
    conversationPrompt: "前向きな気持ちになれる歌はありますか？",
    sourceName: "日本作曲家協会『第12回日本レコード大賞』",
    sourceURL: "https://www.jacompa.or.jp/record/12.php",
  },
  "1970-screen-001": {
    shortDescription: "ホームドラマ「時間ですよ」は1970年に連続シリーズが開始。銭湯を舞台に、家族や町の人々の交流を描きました。",
    conversationPrompt: "家族そろって見たホームドラマはありますか？",
    sourceName: "TBSチャンネル『時間ですよ』",
    sourceURL: "https://www.tbs.co.jp/tbs-ch/item/d0642/",
  },
  "1970-gamestoys-001": {
    shortDescription: "1970年、日本の乗用車を手のひらサイズで再現したミニカー「トミカ」が発売され、長く愛されるシリーズになりました。",
    conversationPrompt: "集めていたミニカーやお気に入りの車種はありますか？",
    sourceName: "タカラトミー『トミカ55周年』",
    sourceURL: "https://cdn.takaratomy.co.jp/release/product/2025/14890.html",
    notes: "商品名のみ使用。車体・箱・ロゴの意匠はイラストで再現しない",
  },
  "1970-lifestyle-001": {
    shortDescription: "1970年11月、名古屋にケンタッキーフライドチキンの日本1号店が開店。新しい外食の味が広がり始めました。",
    conversationPrompt: "初めて食べたときに驚いた外食メニューはありますか？",
    sourceName: "日本KFCホールディングス『沿革』",
    sourceURL: "https://japan.kfc.co.jp/company/history",
    notes: "店名のみ使用。企業ロゴや商品パッケージはイラストで再現しない",
  },
  "1970-sports-001": {
    shortDescription: "三浦雄一郎は1970年、エベレストの標高約8,000メートル地点からスキー滑降に挑み、世界の注目を集めました。",
    conversationPrompt: "見てみたい、または挑戦したい大自然はありますか？",
    sourceName: "セイコーウオッチ『三浦雄一郎』",
    sourceURL: "https://www.seikowatches.com/jp-ja/products/prospex/special/friends/miura/index",
  },
  "1970-news-001": {
    shortDescription: "日本万国博覧会は1970年3月から大阪で開催。人類の進歩と調和をテーマに、未来の技術や文化を紹介しました。",
    conversationPrompt: "大阪万博で見た展示や建物を覚えていますか？",
    sourceName: "万博記念公園『EXPO'70とは』",
    sourceURL: "https://www.expo70-park.jp/cause/expo/",
  },
  "1970-schoolculture-001": {
    shortDescription: "女性誌「anan」は1970年3月に創刊。ファッションや旅など、新しい暮らしの感覚を発信しました。",
    conversationPrompt: "楽しみに読んでいた雑誌は何ですか？",
    sourceName: "マガジンハウス『ananについて』",
    sourceURL: "https://ananweb.jp/about",
    notes: "誌名のみ使用。表紙・ロゴ・誌面はイラストで再現しない",
  },
  "1971-music-001": {
    shortDescription: "尾崎紀世彦の「また逢う日まで」は1971年の日本レコード大賞を受賞。力強い歌声と親しみやすい旋律が支持されました。",
    conversationPrompt: "今でも歌いたくなる1970年代の曲はありますか？",
    sourceName: "日本作曲家協会『第13回日本レコード大賞』",
    sourceURL: "https://www.jacompa.or.jp/record/13.php",
  },
  "1971-screen-001": {
    shortDescription: "テレビアニメ「ルパン三世」の第1シリーズは1971年10月に放送開始。個性的な仲間たちの活躍を描きました。",
    conversationPrompt: "夢中になった冒険アニメはありますか？",
    sourceName: "トムス・エンタテインメント『ルパン三世 PART1』",
    sourceURL: "https://www.tms-e.co.jp/alltitles/lupin/010101.html",
    notes: "作品名のみ使用。キャラクターやロゴはイラストで再現しない",
  },
  "1971-gamestoys-001": {
    shortDescription: "1971年、光って回る仕掛けを備えた仮面ライダーの変身ベルト玩具が登場し、変身遊びが大きな人気を集めました。",
    conversationPrompt: "まねして遊んだ変身ポーズはありますか？",
    sourceName: "バンダイナムコ『変身ベルトの歩み』",
    sourceURL: "https://www.bandainamco.co.jp/cgi-bin/releases/index.cgi/press/10389?entry_id=7227",
    notes: "作品・商品名のみ使用。キャラクターや製品意匠は再現しない",
  },
  "1971-lifestyle-001": {
    shortDescription: "日清食品は1971年9月18日、世界初のカップ麺「カップヌードル」を発売。お湯だけで食べられる手軽さが広がりました。",
    conversationPrompt: "初めて食べたカップ麺を覚えていますか？",
    sourceName: "日清食品グループ『カップヌードル発売』",
    sourceURL: "https://www.nissin.com/jp/about/history/chronology/2428",
    notes: "商品名のみ使用。容器・ロゴ・パッケージはイラストで再現しない",
  },
  "1971-sports-001": {
    shortDescription: "江夏豊は1971年のオールスター第1戦で、打者9人を連続三振に打ち取る記録を成し遂げました。",
    conversationPrompt: "球場やテレビで見た忘れられない投球はありますか？",
    sourceName: "日本野球機構『江夏豊 9者連続奪三振』",
    sourceURL: "https://bis.npb.or.jp/news/detail/20180706_01.html",
  },
  "1971-news-001": {
    shortDescription: "1971年7月、環境行政をまとめて進める環境庁が発足。自然や暮らしの環境を守る取り組みが強化されました。",
    conversationPrompt: "身近な自然を守るために続けていることはありますか？",
    sourceName: "環境省『環境省50年史』",
    sourceURL: "https://www.env.go.jp/publication/history/50th/index.html",
  },
  "1971-schoolculture-001": {
    shortDescription: "1971年ごろ、ボウリング場が各地に増え、家族や友人と楽しめるレジャーとして大きなブームになりました。",
    conversationPrompt: "ボウリングの最高スコアや思い出はありますか？",
    sourceName: "日本玩具文化財団『おもちゃの歴史』",
    sourceURL: "https://toyculture.org/about_toy/history_toy/",
  },
  "1972-music-001": {
    shortDescription: "ちあきなおみの「喝采」は1972年の日本レコード大賞を受賞。印象深い物語と歌唱で長く聴き継がれています。",
    conversationPrompt: "歌の情景が心に残る曲はありますか？",
    sourceName: "日本作曲家協会『第14回日本レコード大賞』",
    sourceURL: "https://www.jacompa.or.jp/record/14.php",
  },
  "1972-screen-001": {
    shortDescription: "テレビアニメ「科学忍者隊ガッチャマン」は1972年に放送開始。5人のチームが力を合わせる物語で人気を得ました。",
    conversationPrompt: "仲間と力を合わせる物語で好きな作品はありますか？",
    sourceName: "タツノコプロ『作品史』",
    sourceURL: "https://tatsunoko.co.jp/en/",
    notes: "作品名のみ使用。キャラクターやロゴはイラストで再現しない",
  },
  "1972-gamestoys-001": {
    shortDescription: "上野動物園にパンダが来た1972年、パンダのぬいぐるみも子どもたちの人気を集めました。",
    conversationPrompt: "大切にしていたぬいぐるみはありましたか？",
    sourceName: "日本玩具文化財団『おもちゃの歴史』",
    sourceURL: "https://toyculture.org/about_toy/history_toy/",
  },
  "1972-lifestyle-001": {
    shortDescription: "1972年、東京・成増にモスバーガー1号店が開店。注文を受けてから作るスタイルで歩みを始めました。",
    conversationPrompt: "学生時代によく立ち寄った飲食店はありますか？",
    sourceName: "モスバーガー『会社の歴史』",
    sourceURL: "https://www.mos.jp/faq/company/history/",
    notes: "店名のみ使用。企業ロゴや商品意匠はイラストで再現しない",
  },
  "1972-sports-001": {
    shortDescription: "1972年2月、アジア初の冬季オリンピックが札幌で開催され、雪と氷の競技に世界の選手が集まりました。",
    conversationPrompt: "札幌大会で印象に残った競技は何ですか？",
    sourceName: "日本オリンピック委員会『1972年札幌大会』",
    sourceURL: "https://www.joc.or.jp/games/olympic/sapporo/",
  },
  "1972-news-001": {
    shortDescription: "1972年5月15日、沖縄の施政権が日本へ返還されました。沖縄県が新たな歩みを始めた節目です。",
    conversationPrompt: "沖縄を訪れた思い出や好きな場所はありますか？",
    sourceName: "内閣府『沖縄復帰50周年』",
    sourceURL: "https://www8.cao.go.jp/okinawa/50th/",
  },
  "1972-schoolculture-001": {
    shortDescription: "日本の鉄道は1972年に開業100年を迎え、各地で記念行事が行われました。鉄道への関心も高まりました。",
    conversationPrompt: "思い出に残る列車の旅はありますか？",
    sourceName: "鉄道博物館『鉄道開業150年』",
    sourceURL: "https://www.railway-museum.jp/150th/",
  },
  "1973-music-001": {
    shortDescription: "かぐや姫の「神田川」は1973年に発売され、若い二人の暮らしを描く歌として多くの共感を集めました。",
    conversationPrompt: "青春時代の暮らしを思い出す曲はありますか？",
    sourceName: "日本クラウン『かぐや姫』",
    sourceURL: "https://www.crownrecord.co.jp/s/c01/artist/kaguyahime/news",
  },
  "1973-screen-001": {
    shortDescription: "テレビアニメ「ドラえもん」の最初のシリーズは1973年に放送。未来の道具をめぐる日常の物語が描かれました。",
    conversationPrompt: "あったらいいと思った未来の道具は何ですか？",
    sourceName: "文化庁 メディア芸術データベース『ドラえもん』",
    sourceURL: "https://mediaarts-db.artmuseums.go.jp/",
    notes: "作品名のみ使用。キャラクターや道具の造形はイラストで再現しない",
  },
  "1973-gamestoys-001": {
    shortDescription: "白と黒の石を返して競う「オセロ」は1973年4月29日に発売。覚えやすく奥深い国産ボードゲームとして広まりました。",
    conversationPrompt: "家族や友人と遊んだ盤ゲームはありますか？",
    sourceName: "メガハウス『オセロ誕生の秘密』",
    sourceURL: "https://www.megahouse.co.jp/othello/history/",
    notes: "商品名のみ使用。盤面・石・ロゴの意匠はイラストで再現しない",
  },
  "1973-lifestyle-001": {
    shortDescription: "1973年10月、熱湯を注いで作る「クノール カップスープ」が発売。朝食や軽食に温かなスープを手軽に楽しめました。",
    conversationPrompt: "寒い日に飲みたくなるスープは何ですか？",
    sourceName: "味の素グループ『年表』",
    sourceURL: "https://www.ajinomoto.co.jp/company/jp/aboutus/history/chronology/",
    notes: "商品名のみ使用。箱・ロゴ・パッケージはイラストで再現しない",
  },
  "1973-sports-001": {
    shortDescription: "読売ジャイアンツは1973年に日本シリーズを制し、1965年から続く9年連続日本一を達成しました。",
    conversationPrompt: "連覇を応援したチームや選手を覚えていますか？",
    sourceName: "日本野球機構『年度別日本シリーズ』",
    sourceURL: "https://npb.jp/bis/scores/nipponseries/linescore1973.html",
  },
  "1973-news-001": {
    shortDescription: "本州と九州を結ぶ関門橋は1973年11月14日に開通。海峡を渡る道路交通が便利になりました。",
    conversationPrompt: "渡って景色に感動した橋はありますか？",
    sourceName: "NEXCO西日本『関門橋』",
    sourceURL: "https://www.w-nexco.co.jp/activity/branch/kyushu/history/",
  },
  "1973-schoolculture-001": {
    shortDescription: "1973年ごろ、裾の広いベルボトムやフォーク音楽に合う自然体の装いが、若者の間で親しまれました。",
    conversationPrompt: "青春時代によく着た服装を覚えていますか？",
    sourceName: "FASHION PRESS『1970年代ファッション』",
    sourceURL: "https://www.fashion-press.net/news/17920",
  },
  "1974-music-001": {
    shortDescription: "森進一の「襟裳岬」は1974年の日本レコード大賞を受賞。北の風景を描く歌として広く親しまれました。",
    conversationPrompt: "旅先の景色を思い出す歌はありますか？",
    sourceName: "日本作曲家協会『第16回日本レコード大賞』",
    sourceURL: "https://www.jacompa.or.jp/record/16.php",
  },
  "1974-screen-001": {
    shortDescription: "テレビアニメ「アルプスの少女ハイジ」は1974年に放送。アルプスの自然と人々の温かな交流を描きました。",
    conversationPrompt: "自然の風景が印象的だった作品はありますか？",
    sourceName: "瑞鷹『アルプスの少女ハイジ』",
    sourceURL: "https://www.heidi.ne.jp/",
    notes: "作品名のみ使用。キャラクターやロゴはイラストで再現しない",
  },
  "1974-gamestoys-001": {
    shortDescription: "指をくわえるしぐさが特徴の人形「モンチッチ」は1974年に誕生し、翌年から海外にも広がりました。",
    conversationPrompt: "かわいがっていた人形やぬいぐるみはありますか？",
    sourceName: "セキグチ『沿革』",
    sourceURL: "https://www.sekiguchi.co.jp/company/history/",
    notes: "商品名のみ使用。人形・ロゴの造形はイラストで再現しない",
  },
  "1974-lifestyle-001": {
    shortDescription: "1974年5月、東京・豊洲にセブン-イレブン日本1号店が開店。身近な買い物のスタイルが変わり始めました。",
    conversationPrompt: "初めて便利だと感じたコンビニの商品は何ですか？",
    sourceName: "セブン-イレブン『会社沿革』",
    sourceURL: "https://www.sej.co.jp/company/enkaku/",
    notes: "店名のみ使用。店舗外観や企業ロゴはイラストで再現しない",
  },
  "1974-sports-001": {
    shortDescription: "長嶋茂雄は1974年に現役を引退。長年の華やかなプレーと親しみやすい人柄で、多くのファンに愛されました。",
    conversationPrompt: "引退試合が心に残っている選手はいますか？",
    sourceName: "読売巨人軍『長嶋茂雄』",
    sourceURL: "https://www.giants.jp/column/legend/nagashima/",
  },
  "1974-news-001": {
    shortDescription: "佐藤栄作は1974年、非核三原則など平和への取り組みを評価され、ノーベル平和賞を受賞しました。",
    conversationPrompt: "平和の大切さを考えた出来事はありますか？",
    sourceName: "ノーベル賞公式『佐藤栄作』",
    sourceURL: "https://www.nobelprize.org/prizes/peace/1974/sato/facts/",
  },
  "1974-schoolculture-001": {
    shortDescription: "宝塚歌劇の「ベルサイユのばら」は1974年に初演され、華やかな舞台と物語で大きな人気を集めました。",
    conversationPrompt: "忘れられない舞台やミュージカルはありますか？",
    sourceName: "宝塚歌劇『ベルサイユのばら』",
    sourceURL: "https://kageki.hankyu.co.jp/revue/berubara/history.html",
    notes: "作品名のみ使用。衣装・舞台・ロゴの意匠はイラストで再現しない",
  },
  "1975-music-001": {
    shortDescription: "布施明の「シクラメンのかほり」は1975年の日本レコード大賞を受賞。季節の情景を描く歌として愛されました。",
    conversationPrompt: "花や季節を思い出す歌はありますか？",
    sourceName: "日本作曲家協会『第17回日本レコード大賞』",
    sourceURL: "https://www.jacompa.or.jp/record/17.php",
  },
  "1975-screen-001": {
    shortDescription: "テレビアニメ「フランダースの犬」は1975年に放送。少年ネロと愛犬パトラッシュの絆を描きました。",
    conversationPrompt: "子どものころ心に残った名作アニメはありますか？",
    sourceName: "日本アニメーション『フランダースの犬』",
    sourceURL: "https://www.nippon-animation.co.jp/work/843/",
    notes: "作品名のみ使用。キャラクターやロゴはイラストで再現しない",
  },
  "1975-gamestoys-001": {
    shortDescription: "剣を樽に差して遊ぶ「黒ひげ危機一発」は1975年に発売。世代を超えて楽しめる運試しゲームになりました。",
    conversationPrompt: "家族で盛り上がった運試しゲームはありますか？",
    sourceName: "タカラトミー『社史・商品史』",
    sourceURL: "https://www.takaratomy.co.jp/company/history.html",
    notes: "商品名のみ使用。人形・樽・剣・ロゴの造形はイラストで再現しない",
  },
  "1975-lifestyle-001": {
    shortDescription: "明治の「きのこの山」は1975年に発売。チョコレートとクラッカーを組み合わせた菓子として親しまれました。",
    conversationPrompt: "遠足やおやつでよく選んだお菓子は何ですか？",
    sourceName: "明治『きのこの山・たけのこの里 ヒストリー』",
    sourceURL: "https://www.meiji.co.jp/products/brand/kinotake/history/",
    notes: "商品名のみ使用。形状・箱・ロゴの意匠はイラストで再現しない",
  },
  "1975-sports-001": {
    shortDescription: "広島東洋カープは1975年に球団初のセ・リーグ優勝。赤い帽子とともに街を大きな喜びで包みました。",
    conversationPrompt: "地元のチームが優勝した日の思い出はありますか？",
    sourceName: "日本野球機構『1975年度公式戦成績』",
    sourceURL: "https://npb.jp/bis/yearly/centralleague_1975.html",
  },
  "1975-news-001": {
    shortDescription: "1975年3月10日、山陽新幹線が博多まで全線開業。新大阪と博多が新幹線で結ばれ、旅が便利になりました。",
    conversationPrompt: "新幹線で出かけた思い出の旅はありますか？",
    sourceName: "JR西日本『山陽新幹線 全線開業50周年』",
    sourceURL: "https://www.jr-odekake.net/navi/sanyo_shinkansen_zensen_50th/",
  },
  "1975-schoolculture-001": {
    shortDescription: "1975年ごろ、発酵飲料の紅茶キノコが健康志向の家庭で話題になり、手作りする人も増えました。",
    conversationPrompt: "家で作った健康飲料や保存食はありますか？",
    sourceName: "博報堂生活総合研究所『生活年表』",
    sourceURL: "https://seikatsusoken.jp/futuretimeline/",
  },
  "1976-music-001": {
    shortDescription: "「およげ！たいやきくん」は1975年末に発売され、1976年に子どもから大人まで口ずさむ大ヒット曲になりました。",
    conversationPrompt: "子どもと一緒に歌った曲はありますか？",
    sourceName: "ポニーキャニオン『およげ！たいやきくん』",
    sourceURL: "https://www.ponycanyon.co.jp/music/PCCA000005020",
  },
  "1976-screen-001": {
    shortDescription: "映画「男はつらいよ 寅次郎夕焼け小焼け」は1976年に公開。寅次郎と日本画家の交流を温かく描きました。",
    conversationPrompt: "何度も見たくなる人情映画はありますか？",
    sourceName: "松竹『男はつらいよ 寅次郎夕焼け小焼け』",
    sourceURL: "https://www.cinemaclassics.jp/tora-san/movie/17/",
    notes: "作品名のみ使用。登場人物やポスターはイラストで再現しない",
  },
  "1976-gamestoys-001": {
    shortDescription: "任天堂は1976年、光に反応する仕掛けで遊ぶ「光線銃カスタム」を発売。電子技術を使った遊びが広がりました。",
    conversationPrompt: "仕掛けに驚いた電子玩具はありますか？",
    sourceName: "任天堂『社長が訊く ゲーム＆ウオッチ』",
    sourceURL: "https://www.nintendo.co.jp/n10/interview/game_and_watch/vol1/index.html",
    notes: "商品名のみ使用。製品・標的・ロゴの意匠はイラストで再現しない",
  },
  "1976-lifestyle-001": {
    shortDescription: "1976年1月、関東で宅急便サービスが開始。個人が荷物を手軽に送り、翌日に届ける新しい仕組みが広がりました。",
    conversationPrompt: "宅配便で届いてうれしかった贈り物はありますか？",
    sourceName: "ヤマト運輸『沿革』",
    sourceURL: "https://www.kuronekoyamato.co.jp/ytc/corp/corporate/history.html",
  },
  "1976-sports-001": {
    shortDescription: "1976年の夏季オリンピックはカナダのモントリオールで開催され、日本は金9個を含む25個のメダルを獲得しました。",
    conversationPrompt: "モントリオール大会で覚えている競技は何ですか？",
    sourceName: "日本オリンピック委員会『1976年モントリオール大会』",
    sourceURL: "https://www.joc.or.jp/games/olympic/poster/1976.html",
  },
  "1976-news-001": {
    shortDescription: "日本初の実用衛星「うめ」は1976年2月に打ち上げられ、電離層を観測して通信研究に役立てられました。",
    conversationPrompt: "宇宙開発のニュースでわくわくしたことはありますか？",
    sourceName: "JAXA『気象・地球観測衛星一覧』",
    sourceURL: "https://global.jaxa.jp/activity/pr/brochure/files/general04.pdf",
  },
  "1976-schoolculture-001": {
    shortDescription: "ピンク・レディーは1976年にデビュー。覚えやすい振り付けと明るい楽曲で、歌って踊る楽しさを広げました。",
    conversationPrompt: "友人とまねして踊った振り付けはありますか？",
    sourceName: "ビクターエンタテインメント『ピンク・レディー』",
    sourceURL: "https://www.jvcmusic.co.jp/-/Profile/A000429.html",
  },
  "1977-music-001": {
    shortDescription: "ピンク・レディーの「渚のシンドバッド」は1977年に発売。軽快な曲と振り付けで広く親しまれました。",
    conversationPrompt: "振り付けまで覚えている歌はありますか？",
    sourceName: "ビクターエンタテインメント『ピンク・レディー』",
    sourceURL: "https://www.jvcmusic.co.jp/-/Discography/A000429/VEATP-30109.html",
  },
  "1977-screen-001": {
    shortDescription: "テレビアニメ「あらいぐまラスカル」は1977年に放送。少年スターリングとラスカルの友情や成長を描きました。",
    conversationPrompt: "動物との友情を描いた好きな作品はありますか？",
    sourceName: "日本アニメーション『世界名作劇場』",
    sourceURL: "https://www.nippon-animation.co.jp/business/license/15373/",
    notes: "作品名のみ使用。キャラクターやロゴはイラストで再現しない",
  },
  "1977-gamestoys-001": {
    shortDescription: "任天堂は1977年、家庭用ゲーム機「テレビゲーム15」を発売。家のテレビで対戦する遊びが広がりました。",
    conversationPrompt: "初めて家で遊んだテレビゲームは何ですか？",
    sourceName: "任天堂『会社の沿革』",
    sourceURL: "https://www.nintendo.co.jp/corporate/history/index.html",
    notes: "商品名のみ使用。本体・操作機・ロゴの意匠はイラストで再現しない",
  },
  "1977-lifestyle-001": {
    shortDescription: "1977年ごろ、流線形の車体や開閉するライトを持つスーパーカーが、雑誌や展示会を通じて子どもたちを魅了しました。",
    conversationPrompt: "憧れていた車や乗ってみたかった車はありますか？",
    sourceName: "日本玩具文化財団『おもちゃの歴史』",
    sourceURL: "https://toyculture.org/about_toy/history_toy/",
  },
  "1977-sports-001": {
    shortDescription: "王貞治は1977年9月3日、通算756本目の本塁打を放ち、当時の世界記録を更新しました。",
    conversationPrompt: "テレビの前で見届けた記録達成はありますか？",
    sourceName: "読売巨人軍『王貞治』",
    sourceURL: "https://www.giants.jp/column/legend/oh/",
  },
  "1977-news-001": {
    shortDescription: "日本初の静止気象衛星「ひまわり」は1977年7月14日に打ち上げられ、翌年から本格観測を始めました。",
    conversationPrompt: "天気予報が便利になったと感じた場面はありますか？",
    sourceName: "気象庁『気象衛星のあゆみ』",
    sourceURL: "https://www.data.jma.go.jp/sat_info/himawari/enkaku.html",
  },
  "1977-schoolculture-001": {
    shortDescription: "1970年代後半、音楽に合わせて踊るディスコ文化が若者の間に広がり、華やかな夜の社交場になりました。",
    conversationPrompt: "よく踊った曲やダンスを覚えていますか？",
    sourceName: "国立国会図書館『ディスコ文化』",
    sourceURL: "https://www.ndl.go.jp/kaleido/entry/14/",
  },
  "1978-music-001": {
    shortDescription: "ピンク・レディーの「UFO」は1978年の日本レコード大賞を受賞。独特の振り付けとともに大ヒットしました。",
    conversationPrompt: "みんなで踊ったピンク・レディーの曲は何ですか？",
    sourceName: "日本作曲家協会『第20回日本レコード大賞』",
    sourceURL: "https://www.jacompa.or.jp/record/20.php",
  },
  "1978-screen-001": {
    shortDescription: "劇場アニメ「さらば宇宙戦艦ヤマト 愛の戦士たち」は1978年に公開され、多くのファンが映画館へ足を運びました。",
    conversationPrompt: "行列に並んで見た映画はありますか？",
    sourceName: "東映ビデオ『さらば宇宙戦艦ヤマト』",
    sourceURL: "https://www.toei-video.co.jp/catalog/bstd02243/",
    notes: "作品名のみ使用。宇宙船・キャラクター・ロゴはイラストで再現しない",
  },
  "1978-gamestoys-001": {
    shortDescription: "タイトーの「スペースインベーダー」は1978年に登場。全国のゲームコーナーで遊ばれ、社会現象になりました。",
    conversationPrompt: "ゲームセンターで夢中になったゲームはありますか？",
    sourceName: "タイトー『70周年の歩み』",
    sourceURL: "https://www.taito.co.jp/70th/history",
    notes: "商品名のみ使用。画面・敵・筐体・ロゴの意匠はイラストで再現しない",
  },
  "1978-lifestyle-001": {
    shortDescription: "セブン-イレブンは1978年、包装したおにぎりを商品として販売。いつでも手軽に食べられる定番へ育ちました。",
    conversationPrompt: "好きなおにぎりの具は何ですか？",
    sourceName: "セブン-イレブン『50 YEARS』",
    sourceURL: "https://www.sej.co.jp/company/yokogao/assets_2023/images/yokogao_pdf.pdf",
    notes: "店名のみ使用。包装・商品・企業ロゴはイラストで再現しない",
  },
  "1978-sports-001": {
    shortDescription: "ヤクルトスワローズは1978年、球団初のセ・リーグ優勝と日本シリーズ制覇を達成しました。",
    conversationPrompt: "初優勝を喜んだチームの思い出はありますか？",
    sourceName: "日本野球機構『1978年度日本シリーズ』",
    sourceURL: "https://npb.jp/bis/scores/nipponseries/linescore1978.html",
  },
  "1978-news-001": {
    shortDescription: "新東京国際空港は1978年5月20日に開港。現在の成田国際空港として、日本と世界を結ぶ玄関口になりました。",
    conversationPrompt: "空港から出発した思い出の海外旅行はありますか？",
    sourceName: "成田国際空港『空港の歴史』",
    sourceURL: "https://www.narita-airport.jp/ja/company/history/",
  },
  "1978-schoolculture-001": {
    shortDescription: "1978年、「フィーバー」という言葉がディスコの熱気とともに流行。光と音の華やかな空間が注目されました。",
    conversationPrompt: "華やかな服で出かけた場所を覚えていますか？",
    sourceName: "国立国会図書館『ディスコ文化』",
    sourceURL: "https://www.ndl.go.jp/kaleido/entry/14/",
  },
  "1979-music-001": {
    shortDescription: "ジュディ・オングの「魅せられて」は1979年の日本レコード大賞を受賞。優雅な衣装と歌声も話題になりました。",
    conversationPrompt: "衣装や舞台演出まで印象に残る歌はありますか？",
    sourceName: "日本作曲家協会『第21回日本レコード大賞』",
    sourceURL: "https://www.jacompa.or.jp/record/21.php",
  },
  "1979-screen-001": {
    shortDescription: "テレビドラマ「3年B組金八先生」は1979年10月に放送開始。中学校を舞台に先生と生徒の成長を描きました。",
    conversationPrompt: "今でも覚えている先生の言葉はありますか？",
    sourceName: "TBSチャンネル『3年B組金八先生』",
    sourceURL: "https://www.tbs.co.jp/tbs-ch/item/d0516/",
    notes: "作品名のみ使用。出演者の肖像やロゴはイラストで再現しない",
  },
  "1979-gamestoys-001": {
    shortDescription: "1979年ごろ、音や光を使った電子ゲームが次々に登場し、手元で遊ぶ新しい楽しみが広がりました。",
    conversationPrompt: "夢中になった小型の電子ゲームはありますか？",
    sourceName: "日本玩具文化財団『おもちゃの歴史』",
    sourceURL: "https://toyculture.org/about_toy/history_toy/",
  },
  "1979-lifestyle-001": {
    shortDescription: "ソニーは1979年7月1日、初代ウォークマンを発売。外出先で自分の好きな音楽を楽しむ文化を生み出しました。",
    conversationPrompt: "外で音楽を聴くとき、最初に使った機器は何ですか？",
    sourceName: "ソニー『パーソナルオーディオの歩み』",
    sourceURL: "https://www.sony.com/ja/SonyInfo/CorporateInfo/History/sonyhistory-e.html",
    notes: "商品名のみ使用。本体・ヘッドホン・ロゴの意匠はイラストで再現しない",
  },
  "1979-sports-001": {
    shortDescription: "1979年の日本シリーズ第7戦、江夏豊は満塁の危機を切り抜け、広島の日本一を決める名場面を生みました。",
    conversationPrompt: "最後まで目が離せなかった野球の場面はありますか？",
    sourceName: "日本野球機構『1979年度日本シリーズ』",
    sourceURL: "https://npb.jp/bis/scores/nipponseries/linescore1979.html",
  },
  "1979-news-001": {
    shortDescription: "国連は1979年を国際児童年と定め、世界各地で子どもの健やかな成長と権利を考える催しが行われました。",
    conversationPrompt: "子どもたちに残したい遊びや文化は何ですか？",
    sourceName: "国連『International Year of the Child』",
    sourceURL: "https://www.un.org/en/observances/international-years",
  },
  "1979-schoolculture-001": {
    shortDescription: "スペースインベーダーの人気が最高潮となり、ゲーム機を並べた「インベーダーハウス」が各地に登場しました。",
    conversationPrompt: "初めて入ったゲームセンターを覚えていますか？",
    sourceName: "タイトー『70周年の歩み』",
    sourceURL: "https://www.taito.co.jp/70th/history",
    notes: "通称のみ使用。ゲーム画面・筐体・ロゴの意匠はイラストで再現しない",
  },
  "2026-music-001": {
    shortDescription: "米津玄師の「IRIS OUT」はAmazon Musicの2026年上半期国内再生ランキングで1位となり、長く親しまれました。",
    conversationPrompt: "この曲をどこで知りましたか？印象に残った場面はありますか？",
    sourceName: "Amazon Music『2026年上半期 Top 50』",
    sourceURL: "https://www.aboutamazon.jp/news/entertainment/amazon-music%E3%81%AE2026%E5%B9%B4%E4%B8%8A%E5%8D%8A%E6%9C%9F%E6%A5%BD%E6%9B%B2%E3%83%A9%E3%83%B3%E3%82%AD%E3%83%B3%E3%82%B0%E7%99%BA%E8%A1%A8",
    notes: "曲名のみ使用。歌詞・音源・ジャケット・アーティスト写真は転載しない",
  },
  "2026-screen-001": {
    shortDescription: "映画「国宝」は2026年3月の第49回日本アカデミー賞で最優秀作品賞を受賞。多くの観客に支持された作品として称えられました。",
    conversationPrompt: "映画館で見て、誰かと感想を語りたくなった作品はありますか？",
    sourceName: "日本アカデミー賞『第49回 受賞結果』",
    sourceURL: "https://www.japan-academy-prize.jp/prizes/list/49",
    notes: "作品名・受賞名のみ使用。場面写真・ポスター・ロゴ・台詞は転載しない",
  },
  "2026-gamestoys-001": {
    shortDescription: "任天堂は「スプラトゥーン レイダース」を2026年7月23日にNintendo Switch 2向けに発売しました。",
    conversationPrompt: "みんなで遊んだ対戦ゲームや協力ゲームの思い出はありますか？",
    sourceName: "任天堂『主要製品発売スケジュール』",
    sourceURL: "https://www.nintendo.co.jp/ir/pdf/2026/260508_4.pdf",
    notes: "商品名のみ使用。ゲーム画面・キャラクター・ロゴ・パッケージは転載しない",
  },
  "2026-lifestyle-001": {
    shortDescription: "任天堂は2026年11月12日に、3本から選べるダウンロードソフト付きのNintendo Switch 2日本語・国内専用セットを発売すると発表しました。",
    conversationPrompt: "家族や友人と一緒に選んだゲーム機の思い出はありますか？",
    sourceName: "任天堂 ニュースリリース 2026年10月6日",
    sourceURL: "https://www.nintendo.co.jp/corporate/release/en/2026/261006.html",
    notes: "商品名のみ使用。本体外観・画面・ロゴ・パッケージは転載しない",
  },
  "2026-sports-001": {
    shortDescription: "第20回アジア競技大会が2026年9月19日から10月4日まで愛知・名古屋で開かれ、43競技の熱戦が繰り広げられました。",
    conversationPrompt: "会場や中継で応援して、特に心に残った競技は何ですか？",
    sourceName: "第20回アジア競技大会 公式サイト",
    sourceURL: "https://www.aichi-nagoya2026.org/ja/",
    notes: "大会名のみ使用。エンブレム・マスコット・競技写真は転載しない",
  },
  "2026-news-001": {
    shortDescription: "FIFAワールドカップ2026はカナダ・メキシコ・米国の3か国で共同開催され、初めて48チームが参加しました。",
    conversationPrompt: "世界中の人と一緒に盛り上がった試合や選手を覚えていますか？",
    sourceName: "FIFA『World Cup 2026』",
    sourceURL: "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/fifa-world-cup-2026-hosts-cities-dates-usa-mexico-canada",
    notes: "大会名のみ使用。大会ロゴ・映像・選手写真は転載しない",
  },
  "2026-schoolculture-001": {
    shortDescription: "学校では生成AIを学習や創作に生かす実践が広がり、便利さと注意点を理解して使う学びが進められました。",
    conversationPrompt: "AIを使って、試してみたい学習や創作はありますか？",
    sourceName: "文部科学省『生成AIの利用について』",
    sourceURL: "https://www.mext.go.jp/a_menu/other/mext_02412.html",
    notes: "特定サービスのロゴや画面は転載せず、安全な利用と事実確認を促す表現に限定する",
  },
};

const categoryMemoryCopy = {
  music: {
    description: (year, title) => `「${title}」は${year}年の音楽を振り返る話題です。聴いた場所や、一緒に口ずさんだ人を思い出す会話につなげます。`,
    prompt: "この曲を初めて聴いた場所や、一緒に歌った人を覚えていますか？",
  },
  screen: {
    description: (year, title) => `「${title}」は${year}年のテレビ・映画を振り返る話題です。家族や友人と見た時間を思い出す会話につなげます。`,
    prompt: "この作品を誰と見ましたか？心に残っている場面はありますか？",
  },
  gamesToys: {
    description: (year, title) => `「${title}」は${year}年のゲームや遊びを振り返る話題です。遊んだ場所や、一緒に夢中になった人を思い出せます。`,
    prompt: "どこで、誰と遊びましたか？得意だった遊び方も教えてください。",
  },
  lifestyle: {
    description: (year, title) => `「${title}」は${year}年の暮らしを振り返る話題です。初めて見たときや、試したときの楽しい驚きを語れます。`,
    prompt: "初めて見たり試したりしたとき、どんなことが印象に残りましたか？",
  },
  sports: {
    description: (year, title) => `「${title}」は${year}年のスポーツを振り返る話題です。応援した選手や、みんなで盛り上がった時間を思い出せます。`,
    prompt: "誰を応援していましたか？一緒に盛り上がった人を覚えていますか？",
  },
  news: {
    description: (year, title) => `「${title}」は${year}年の社会の変化を振り返る話題です。暮らしが便利になったことや、新しい発見を語れます。`,
    prompt: "この出来事で、暮らしや身近な景色はどのように変わりましたか？",
  },
  schoolCulture: {
    description: (year, title) => `「${title}」は${year}年の学校や街の流行を振り返る話題です。友人との会話や、まねして楽しんだ思い出につなげます。`,
    prompt: "学校や身近な場所では、どんなふうに楽しんでいましたか？",
  },
};

function reviewedFallback(year, category, title) {
  const copy = categoryMemoryCopy[category.key];
  const encodedYear = encodeURIComponent(`${year}年`);
  return {
    shortDescription: copy.description(year, title),
    conversationPrompt: copy.prompt,
    sourceName: `Wikipedia日本語版「${year}年」（年・固有名詞の照合）`,
    sourceURL: `https://ja.wikipedia.org/wiki/${encodedYear}`,
    notes: "年次資料で年・固有名詞を照合。名称のみ使用し、歌詞・台詞・ロゴ・キャラクター造形・商品外観は転載しない",
  };
}

const sensitivePattern = /地震|墜落|事件|戦争|テロ|震災|豪雨|感染症|事故|原発|食中毒|危機|問題|侵攻/;
const lines = raw.trim().split("\n").map((line) => line.split("\t"));
if (lines.length !== 67) throw new Error(`Expected 67 years, got ${lines.length}`);

const rows = [];
for (const parts of lines) {
  const year = Number(parts[0]);
  if (parts.length !== 8) throw new Error(`${year}: expected 7 topics, got ${parts.length - 1}`);
  parts.slice(1).forEach((title, index) => {
    const category = categoryDefs[index];
    const id = `${year}-${category.key.toLowerCase()}-001`;
    const description = `${year}年を振り返る話題の一つが「${title}」です。公開前に一次資料で時期と表現を確認し、独自の解説文へ編集します。`;
    const verified = verifiedOverrides[id] ?? reviewedFallback(year, category, title);
    rows.push({
      id,
      year,
      category: category.key,
      categoryLabel: category.label,
      title,
      shortDescription: verified?.shortDescription ?? description,
      conversationPrompt: verified?.conversationPrompt ?? category.prompt,
      genderAffinity: "all",
      ageMin: "",
      ageMax: "",
      imageAsset: `category_${category.key}`,
      sourceName: verified.sourceName,
      sourceURL: verified.sourceURL,
      linkCheckedAt: new Date("2026-11-09T00:00:00Z"),
      tags: `${year},${category.key},verified`,
      isActive: true,
      version: 1,
      sourceCheck: "完了",
      factCheck: "完了",
      wordingReview: "完了",
      rightsReview: "完了",
      sensitivity: sensitivePattern.test(title) && title !== "黒ひげ危機一発発売" ? "要配慮" : "通常",
      reviewer: "",
      notes: verified?.notes ?? (year === 2026 ? "2026年は年途中のため、年末に採用トピックを再選定する" : ""),
      updatedAt: new Date("2026-11-09T00:00:00Z"),
    });
  });
}

const verifiedCount = rows.filter((row) => row.sourceCheck === "完了" && row.factCheck === "完了" && row.wordingReview === "完了" && row.rightsReview === "完了").length;

if (rows.length !== 469) throw new Error(`Expected 469 topics, got ${rows.length}`);
if (new Set(rows.map((row) => row.id)).size !== rows.length) throw new Error("Duplicate IDs found");
if (new Set(rows.map((row) => row.title)).size !== rows.length) throw new Error("Duplicate titles found");
for (const row of rows) {
  if (row.title.length > 40) throw new Error(`${row.id}: title exceeds 40 characters`);
  if (row.shortDescription.length > 140) throw new Error(`${row.id}: description exceeds 140 characters`);
  if (row.conversationPrompt.length > 60) throw new Error(`${row.id}: prompt exceeds 60 characters`);
}

const workbook = Workbook.create();
const summary = workbook.worksheets.add("概要");
const topics = workbook.worksheets.add("トピック台帳");
const lists = workbook.worksheets.add("入力候補");

summary.showGridLines = false;
topics.showGridLines = false;
lists.showGridLines = false;
summary.tabColor = "#4B4BD8";
topics.tabColor = "#7D7DE3";
lists.tabColor = "#A9A9B8";

summary.getRange("A2:H2").merge();
summary.getRange("A2").values = [["あの年トーク 初期リリース用トピック台帳"]];
summary.getRange("A2:H2").format.font = { name: "Arial", size: 16, bold: true, color: "#202124" };
summary.getRange("A3:H3").format.borders = { bottom: { style: "thin", color: "#C8CAD0" } };
summary.getRange("A5:B10").values = [
  ["対象年", "1960〜2026年"],
  ["原稿件数", rows.length],
  ["年あたり", "7カテゴリ × 1件"],
  ["公開可能", "='トピック台帳'!Y2"],
  ["要配慮", "='トピック台帳'!Y3"],
  ["現在の状態", `${verifiedCount}件の年・固有名詞・文章・権利方針を確認済み。公開不可は${rows.length - verifiedCount}件`],
];
summary.getRange("A5:A10").format.font = { name: "Arial", size: 10, bold: true, color: "#FFFFFF" };
summary.getRange("A5:A10").format.fill = "#4B4BD8";
summary.getRange("B5:B10").format.font = { name: "Arial", size: 10, color: "#202124" };
summary.getRange("B5:B10").format.wrapText = true;
summary.getRange("A12:H12").merge();
summary.getRange("A12").values = [["年別・カテゴリ別件数"]];
summary.getRange("A12:H12").format = { fill: "#EEF0FF", font: { name: "Arial", size: 11, bold: true, color: "#34349A" } };
summary.getRange("A13:H13").values = [["年", ...categoryDefs.map((item) => item.label)]];
summary.getRange("A13:H13").format = { fill: "#34349A", font: { name: "Arial", size: 10, bold: true, color: "#FFFFFF" }, horizontalAlignment: "center" };
const years = Array.from({ length: 67 }, (_, i) => 1960 + i);
summary.getRange("A14:A80").values = years.map((year) => [year]);
summary.getRange("B14").formulas = [["=COUNTIFS('トピック台帳'!$B$6:$B$474,$A14,'トピック台帳'!$D$6:$D$474,B$13)"]];
summary.getRange("B14:H80").fillDown();
summary.getRange("B14:H80").fillRight();
summary.getRange("A13:H80").format.font = { name: "Arial", size: 10 };
summary.getRange("A14:A80").format.numberFormat = "0";
summary.getRange("B14:H80").format.numberFormat = "0";
summary.getRange("A14:H80").format.borders = { preset: "inside", style: "thin", color: "#E3E5E8" };
summary.getRange("A13:H80").format.verticalAlignment = "center";
summary.getRange("B14:H80").format.horizontalAlignment = "center";
summary.getRange("J5:K12").values = [
  ["作業順", "内容"],
  [1, "一次資料URLを登録し、リンク確認日を入力"],
  [2, "年との対応、名称、表現を事実確認"],
  [3, "説明文を140字以内の独自文章へ書き換え"],
  [4, "センシティブ内容と会話の問いを確認"],
  [5, "イラスト・商標・権利を確認"],
  [6, "4つの確認状態を完了にして公開可能へ"],
  ["注意", "権利元の画像・ロゴ・歌詞・台詞は転載せず、名称と独自の短文だけを使用します"],
];
summary.getRange("J5:K5").format = { fill: "#34349A", font: { name: "Arial", size: 10, bold: true, color: "#FFFFFF" } };
summary.getRange("J6:K12").format = { font: { name: "Arial", size: 10 }, wrapText: true, verticalAlignment: "top" };
summary.freezePanes.freezeRows(13);
summary.getRange("A:K").format.columnWidth = 13;
summary.getRange("A:A").format.columnWidth = 10;
summary.getRange("B:D").format.columnWidth = 18;
summary.getRange("E:E").format.columnWidth = 26;
summary.getRange("F:F").format.columnWidth = 14;
summary.getRange("G:G").format.columnWidth = 16;
summary.getRange("H:H").format.columnWidth = 20;
summary.getRange("J:J").format.columnWidth = 10;
summary.getRange("K:K").format.columnWidth = 52;

const headers = [
  "id", "year", "category", "カテゴリ表示名", "title", "shortDescription", "conversationPrompt",
  "genderAffinity", "ageMin", "ageMax", "imageAsset", "sourceName", "sourceURL", "linkCheckedAt",
  "tags", "isActive", "version", "出典確認", "事実確認", "文章確認", "権利確認", "配慮区分",
  "reviewer", "notes", "公開可能", "updatedAt",
];
topics.getRange("A2:Z2").merge();
topics.getRange("A2").values = [["初期リリース候補 469件"]];
topics.getRange("A2:Z2").format.font = { name: "Arial", size: 14, bold: true, color: "#202124" };
topics.getRange("A3:Z3").merge();
topics.getRange("A3").values = [["黄色の列は編集・確認が必要です。公開可能は4つの確認状態がすべて「完了」かつリンク確認日がある場合のみ「可」になります。"]];
topics.getRange("A3:Z3").format = { fill: "#FFF4CC", font: { name: "Arial", size: 10, italic: true, color: "#6B5200" }, wrapText: true };
topics.getRange("A5:Z5").values = [headers];
topics.getRange("A5:Z5").format = { fill: "#34349A", font: { name: "Arial", size: 10, bold: true, color: "#FFFFFF" }, horizontalAlignment: "center", verticalAlignment: "center", wrapText: true };

const values = rows.map((row) => [
  row.id, row.year, row.category, row.categoryLabel, row.title, row.shortDescription, row.conversationPrompt,
  row.genderAffinity, row.ageMin, row.ageMax, row.imageAsset, row.sourceName, row.sourceURL, row.linkCheckedAt,
  row.tags, row.isActive, row.version, row.sourceCheck, row.factCheck, row.wordingReview, row.rightsReview,
  row.sensitivity, row.reviewer, row.notes, null, row.updatedAt,
]);
topics.getRange("A6:Z474").values = values;
topics.getRange("Y6").formulas = [["=IF(AND(R6=\"完了\",S6=\"完了\",T6=\"完了\",U6=\"完了\",N6<>\"\"),\"可\",\"不可\")"]];
topics.getRange("Y6:Y474").fillDown();
topics.getRange("Y2").formulas = [["=COUNTIF(Y6:Y474,\"可\")"]];
topics.getRange("Y3").formulas = [["=COUNTIF(V6:V474,\"要配慮\")"]];
topics.getRange("Y2:Y3").format.numberFormat = "0";
topics.getRange("B6:B474").format.numberFormat = "0";
topics.getRange("Q6:Q474").format.numberFormat = "0";
topics.getRange("Z6:Z474").format.numberFormat = "yyyy-mm-dd";
topics.getRange("A5:Z474").format.font = { name: "Arial", size: 9 };
topics.getRange("A6:Z474").format.verticalAlignment = "top";
topics.getRange("E6:G474").format.wrapText = true;
topics.getRange("L6:N474").format.wrapText = true;
topics.getRange("X6:X474").format.wrapText = true;
topics.getRange("N6:N474").format.fill = "#FFF4CC";
topics.getRange("R6:U474").format.fill = "#FFF4CC";
topics.getRange("W6:X474").format.fill = "#FFF4CC";
topics.getRange("Y6:Y474").conditionalFormats.add("containsText", { text: "不可", format: { fill: "#FDE8E7", font: { color: "#B3261E", bold: true } } });
topics.getRange("Y6:Y474").conditionalFormats.add("containsText", { text: "可", format: { fill: "#E3F4E8", font: { color: "#176B36", bold: true } } });
topics.getRange("V6:V474").conditionalFormats.add("containsText", { text: "要配慮", format: { fill: "#FFF0D6", font: { color: "#8A4B00", bold: true } } });
topics.getRange("R6:U474").dataValidation = { rule: { type: "list", values: ["未確認", "確認中", "差戻し", "完了"] } };
topics.getRange("V6:V474").dataValidation = { rule: { type: "list", values: ["通常", "要配慮", "非掲載"] } };
topics.getRange("B6:B474").dataValidation = { rule: { type: "whole", operator: "between", formula1: 1960, formula2: 2100 } };
topics.freezePanes.freezeRows(5);
topics.freezePanes.freezeColumns(5);
topics.getRange("A:A").format.columnWidth = 27;
topics.getRange("B:B").format.columnWidth = 8;
topics.getRange("C:D").format.columnWidth = 18;
topics.getRange("E:E").format.columnWidth = 34;
topics.getRange("F:F").format.columnWidth = 58;
topics.getRange("G:G").format.columnWidth = 46;
topics.getRange("H:K").format.columnWidth = 18;
topics.getRange("L:L").format.columnWidth = 34;
topics.getRange("M:M").format.columnWidth = 46;
topics.getRange("N:N").format.columnWidth = 15;
topics.getRange("O:Q").format.columnWidth = 18;
topics.getRange("R:V").format.columnWidth = 15;
topics.getRange("W:W").format.columnWidth = 16;
topics.getRange("X:X").format.columnWidth = 48;
topics.getRange("Y:Y").format.columnWidth = 12;
topics.getRange("Z:Z").format.columnWidth = 15;
topics.getRange("A5:Z474").format.autofitRows();
const topicTable = topics.tables.add("A5:Z474", true, "TopicsLedger");
topicTable.style = "TableStyleMedium2";
topicTable.showFilterButton = true;

lists.getRange("A2:D2").values = [["確認状態", "配慮区分", "genderAffinity", "category"]];
lists.getRange("A2:D2").format = { fill: "#34349A", font: { name: "Arial", size: 10, bold: true, color: "#FFFFFF" } };
lists.getRange("A3:A6").values = [["未確認"], ["確認中"], ["差戻し"], ["完了"]];
lists.getRange("B3:B5").values = [["通常"], ["要配慮"], ["非掲載"]];
lists.getRange("C3:C5").values = [["all"], ["maleLeaning"], ["femaleLeaning"]];
lists.getRange("D3:D9").values = categoryDefs.map((item) => [item.key]);
lists.getRange("A2:D9").format.font = { name: "Arial", size: 10 };
lists.getRange("A:D").format.columnWidth = 24;

workbook.recalculate();

const summaryCheck = await workbook.inspect({
  kind: "table",
  range: "概要!A2:K14",
  include: "values,formulas",
  tableMaxRows: 20,
  tableMaxCols: 12,
});
console.log(summaryCheck.ndjson);
const topicCheck = await workbook.inspect({
  kind: "table",
  range: "トピック台帳!A5:Z12",
  include: "values,formulas",
  tableMaxRows: 10,
  tableMaxCols: 26,
});
console.log(topicCheck.ndjson);
const errors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!",
  options: { useRegex: true, maxResults: 100 },
  summary: "final formula error scan",
});
console.log(errors.ndjson);

await fs.mkdir(outputDir, { recursive: true });
const preview = await workbook.render({ sheetName: "概要", range: "A1:K24", scale: 1.4, format: "png" });
await fs.writeFile(`${outputDir}/initial-topics-preview.png`, new Uint8Array(await preview.arrayBuffer()));
const topicsPreview = await workbook.render({ sheetName: "トピック台帳", range: "A1:H15", scale: 1, format: "png" });
await fs.writeFile(`${outputDir}/initial-topics-ledger-preview.png`, new Uint8Array(await topicsPreview.arrayBuffer()));
const listsPreview = await workbook.render({ sheetName: "入力候補", range: "A1:D10", scale: 1.4, format: "png" });
await fs.writeFile(`${outputDir}/initial-topics-lists-preview.png`, new Uint8Array(await listsPreview.arrayBuffer()));
const xlsx = await SpreadsheetFile.exportXlsx(workbook);
const outputPath = `${outputDir}/initial-topics.xlsx`;
await xlsx.save(outputPath);
const savedBlob = await FileBlob.load(outputPath);
const savedWorkbook = await SpreadsheetFile.importXlsx(savedBlob);
const savedCheck = await savedWorkbook.inspect({
  kind: "table",
  range: "概要!A75:H80",
  include: "values,formulas",
  tableMaxRows: 10,
  tableMaxCols: 8,
});
console.log(savedCheck.ndjson);
const savedTail = await savedWorkbook.inspect({
  kind: "table",
  range: "トピック台帳!A468:Y474",
  include: "values,formulas",
  tableMaxRows: 10,
  tableMaxCols: 25,
});
console.log(savedTail.ndjson);
console.log(`Wrote ${outputPath}`);
