const pictures = [
    {
      title: "Сиреневое великолепие",
      technic: "акрил, текстурная паста",
      size: "30☓30",
      price: 10000,
      image: require("./img/Sirenevoe-velikolepie.jpg"),
      sold: false,
      photos: [
         "Sirenevoe-velikolepie1.jpg", "Sirenevoe-velikolepie2.jpg", "Sirenevoe-velikolepie3.jpg", "Sirenevoe-velikolepie4.jpg",
      ],
      description: `Картина является эдаким порталом, откуда идёт определённая энергия.
       Картина с изображением орхидеи привлекает радость и счастье в дом. 
      Повесив такое украшение в коридоре, вы сразу же с порога отгоняете всё плохое.
      Картина с изображением сиреневой орхидеи идеально подойдёт и для рабочего стола. 
      Привлечёт к своему хозяину всё самое нужное и выгодное в его сфере.`,
      decoration: true
    },
    {
      title: "Манящая",
      technic: "акрил, текстурная паста",
      size: "40☓50",
      price: 7000,
      image: require("./img/moon.jpg"),
      sold: false,
      photos: ["moon1.jpg", "moon2.jpg", "moon3.jpg", "moon4.jpg"],
    },
    {
        title: "Безмятежность",
        technic: "акрил, текстурная паста",
        size: "40☓50",
        price: 12000,
        image: require("./img/bezmyatezhnost.jpg"),
        sold: false,
        photos: ["bezmyatezhnost.jpg","bezmyatezhnost1.jpg", "bezmyatezhnost2.jpg"],
        description: `Эксклюзивная картина ручной работы — это лучший подарок для Ваших близких, 
        друзей и коллег. Картина "Безмятежность" преобразит любой интерьер и будет дарить яркие и 
        позитивные эмоции Вам и Вашим близким!`,
      decoration: true
    },
    {
        title: "Танец пробуждения",
        technic: "акрил, текстурная паста",
        size: "50☓60",
        price: 16000,
        image: require("./img/dance.jpg"),
        sold: false,
        photos: ["dance.jpg","dance1.jpg", "dance2.jpg"],
        description: `Картина с полевыми цветами в высокой траве «Танец пробуждения» выполнена текстурной пастой и акриловыми красками, 
        в том числе золотыми, разных оттенков. Цветы на картине привлекают своей сдержанностью, таинственностью и красотой и символизируют 
        чистоту и невинность. Под разным углом зрения и при разном освещении картина смотрится по-разному. 
        Работа в золотых тонах сделает богаче интерьер и Вашу жизнь.`,
      decoration: true
    },
    {
        title: "Утро туманное",
        technic: "акрил, текстурная паста",
        size: "60☓80",
        price: 32000,
        image: require("./img/morning.jpg"),
        sold: true,
    },
    {
        title: "Зазеркалье",
        technic: "акрил",
        size: "50☓60",
        price: 10500,
        image: require("./img/zazerkalie.jpg"),
        sold: false,
        photos: ["zazerkalie.jpg","zazerkalie1.jpg", "zazerkalie2.jpg"],
        description: `Среди огромного многообразия картин, каждый находит близкую для себя частичку окружающего мира, характера и настроения.
        Вашему вниманию – картина «Зазеркалье», изображающая бурлящую, несущуюся между нетронутой природы реку и вырывающуюся прямо из рамы в наш реальный мир.Картина, где есть водопад, символизирует быструю живую энергию.
        Размещение элементов водной стихии на картинах в доме приносят семейную гармонию.
        Картина с потоком притягивает финансовую стабильность, изобилие, богатство, удачу.
        Если хозяин дома не может нарисовать такую картину, он обязательно ее покупает. Лучше купить у художника, который вкладывает душу в работу.
        `,
      decoration: false
    },
    {
        title: "Хранитель Земли русской",
        technic: "акрил",
        size: "30☓40",
        price: 9000,
        image: require("./img/angel.jpg"),
        sold: true,
    },
    {
        title: "Рождение новой звезды",
        technic: "акрил",
        size: "50☓60",
        price: 18500,
        image: require("./img/A-new-star.jpg"),
        sold: false,
        photos: ["A-new-star1.jpg", "A-new-star2.jpg", "A-new-star3.jpg", "A-new-star4.jpg"],
        description: `        `,
      decoration: false
    },
    {
        title: "Взгляд из другой реальности",
        technic: "акрил, глина, текстурная паста",
        size: "30☓40",
        price: 15000,
        image: require("./img/feya.png"),
        sold: false,
        photos: ["feya.png", "feya1.jpg", "feya2.jpg"],
        description: `Художник создал картину! Он вложил в неё душу, свою любовь, можно сказать, вдохнул в неё жизнь. 
        А если это так, то получается, что по ту сторону картины тоже существует своя реальность. 
        И живущие там существа с изучающим интересом подсматривают за нами.
        Картина «Взгляд из другой реальности» исполнена в 3D – формате. 
        Это картина, к которой так и хочется прикоснуться, почувствовать тот другой, сказочный мир.
        `,
      decoration: true
    },
    {
        title: "В гармонии со стихией",
        technic: "акрил",
        size: "35☓35",
        price: 5000,
        image: require("./img/wave.jpg"),
        sold: true,
    },
    {
        title: "Радость жизни",
        technic: "акрил",
        size: "30☓40",
        price: 6500,
        image: require("./img/life.jpg"),
        sold: true,
    },
    {
        title: "Провожая солнце",
        technic: "акрил",
        size: "35☓25",
        price: 5000,
        image: require("./img/zakat.jpg"),
        sold: false,
        photos: ["zakat.jpg", "zakat1.jpg", "zakat2.jpg"],
        description: `Закат – одно из самых завораживающих явлений природы. Им можно любоваться бесконечно… 
        Самый красивый закат – морской. На картине "Провожая солнце" огненный шар медленно и величественно сползает к линии горизонта, 
        окрашивая небосклон в золотые и красные цвета. Солнце не слепит, как днем, но в то же время оно ликующе пылает, заливая потоками
         сочных красок небосвод, который отражается в море. Глядя на картину, ощущаешь нежность воды... Так и хочется протянуть руку и 
         коснуться золотой дорожки, которая ползет к берегу. Невольно закрадываются мысли об отпуске и поездке к морю. И на душе сразу 
         становится теплее! И жизнь начинает играть новыми красками!
        Успокаивающая и в то же время вдохновляющая картина "Провожая солнце" украсит любой интерьер и будет радовать владельца долгие-долгие годы.
        `,
      decoration: false
    },
    {
        title: "Утренняя симфония",
        technic: "акрил, глина, текстурная паста",
        size: "30☓40",
        price: 15000,
        image: require("./img/morning-simphony.jpg"),
        sold: false,
        photos: ["morning-simphony.jpg", "morning-simphony1.jpg", "morning-simphony2.jpg", "morning-simphony3.jpg"],
        description: `Щегол - символ духовного начала в человеке, а роза - является символом красоты, совершенства,
         радости, любви, блаженства и мудрости. Картина "Утренняя симфония" даже в самый пасмурный день поднимает дух 
         и вдохновляет нести позитив и добро. Приобретая данную картину вы не только становитесь обладателем уникального 
         произведения искусства, созданного вручную, но и получаете эффективный способ изменить жизнь к лучшему, стать успешнее и счастливее.
        `,
      decoration: false
    },
    {
        title: "Наедине",
        technic: "акрил, текстурная паста",
        size: "30☓40",
        price: 7000,
        image: require("./img/naedine.jpg"),
        sold: false,
        photos: ["naedine.jpg", "naedine1.jpg", "naedine2.jpg", "naedine3.jpg", "naedine4.jpg"]
    },
    {
        title: "Остров надежды",
        technic: "акварель",
        size: "30☓40",
        price: 7500,
        image: require("./img/lighthouse.jpg"),
        sold: true,
    },
    {
        title: "Взгляд на неизведанное",
        technic: "акрил",
        size: "40☓50",
        price: 7000,
        image: require("./img/cat.jpg"),
        sold: false,
        photos: ["cat1.jpg", "cat2.jpg", "cat3.jpg", "cat4.jpg"]
    },
    {
        title: "Морская соблазнительница",
        technic: "акрил",
        size: "50☓50",
        price: 20000,
        image: require("./img/rusalka.jpg"),
        sold: false,
        photos: ["rusalka1.jpg", "rusalka2.jpg", "rusalka3.jpg", "rusalka4.jpg"],  
        description: `Хотите больше радости и счастья? 
        Окружайте себя яркими картинами! Такие картины всегда несут позитив, вдохновение и отличное настроение!
         Глядя на картину "Морская соблазнительница", так и хочется представить, что же будет происходить дальше! 
         Загадочная, яркая, красочная картина украсит любой интерьер и станет для Вас одной из любимых.
       `,
     decoration: false
    },
    {
        title: "Поздняя осень",
        technic: "акрил,",
        size: "30☓40",
        price: 5500,
        image: require("./img/autumn.jpg"),
        sold: true,
    },
    {
        title: "Спокойное величие",
        technic: "акрил",
        size: "40☓50",
        price: 8500,
        image: require("./img/lev.jpg"),
        sold: false,
        photos: ["lev1.jpg", "lev2.jpg", "lev3.jpg", "lev4.jpg"],
        description: `Хотите больше радости и счастья? 
        Окружайте себя яркими картинами! Такие картины всегда несут позитив, вдохновение и отличное настроение!
         Глядя на картину "Морская соблазнительница", так и хочется представить, что же будет происходить дальше! 
         Загадочная, яркая, красочная картина украсит любой интерьер и станет для Вас одной из любимых.
       `,
     decoration: false
    },
    {
        title: "У огонька",
        technic: "акрил",
        size: "40☓50",
        price: 8500,
        image: require("./img/red-bird.jpg"),
        sold: false,
        photos: ["red-bird1.jpg", "red-bird2.jpg", "red-bird3.jpg", "red-bird4.jpg"]
    },
    {
        title: "Тайное свидание",
        technic: "акрил",
        size: "50☓60",
        price: 12000,
        image: require("./img/svidanie.jpg"),
        sold: false,
        photos: ["svidanie1.jpg", "svidanie2.jpg", "svidanie3.jpg", "svidanie4.jpg"]
    },
    {
        title: "Отражение ясного дня",
        technic: "акрил",
        size: "50☓60",
        price: 12000,
        image: require("./img/palace.jpg"),
        sold: true,
    },
    {
        title: "Красное очарование",
        technic: "акрил, текстурная паста",
        size: "3 модуля 25☓35",
        price: 7500,
        image: require("./img/maki.jpg"),
        sold: false,
        photos: ["maki.jpg", "maki1.jpg", "maki2.jpg", "maki3.jpg", "maki4.jpg"],
        description: `Главное значение цветка в первую очередь – это умиротворение и гармония.
        Специалисты в области психологии  рекомендуют помещать в свой домашний интерьер картины с изображением маков:
       •	маки благотворно воздействует на сферу любви и отношений. Они, как магнит, притягивают к человеку настоящую любовь.
       Картину с маками можно повесить в спальне, если хотите внести приятные коррективы в ваши семейные отношения.
       •	картина с маками также прекрасно впишется в прихожую и гостиную – там она будет способствовать дружеской и приятной атмосфере между людьми (как между членами семьи, так и между гостями дома).
       •	Маки также очень благоприятно сказываются на отношениях между родителями и детьми, особенно когда дети ведут себя проблемно, находясь в периоде подросткового возраста. Если у вас именно тот случай, тогда повесьте картину с маками в детской комнате или в той части дома, где чаще всего находится ваш ребенок, — это должно помочь скорректировать ваши отношения, наполнив их взаимоуважением и пониманием.
       •	Где размещать картину – решать вам, так как в принципе, её можно располагать в любой зоне помещения, в зависимости от того, какие сферы жизни вы хотите наладить.
       
       Окружайте себя полезными картинами и будьте счастливы!
       `,
       decoration: false
      },
      {
        title: "Утро на реке Вуокса",
        technic: "акрил",
        size: "50☓60",
        price: "8 500",
        image: require("./img/vuoxa1.jpg"),
        sold: false,
        photos: ["vuoxa1.jpg", "vuoxa2.jpg", "vuoxa3.jpg"],
        description: `Главное значение цветка в первую очередь – это умиротворение и гармония.
        Специалисты в области психологии  рекомендуют помещать в свой домашний интерьер картины с изображением маков:
       •	маки благотворно воздействует на сферу любви и отношений. Они, как магнит, притягивают к человеку настоящую любовь.
       Картину с маками можно повесить в спальне, если хотите внести приятные коррективы в ваши семейные отношения.
       •	картина с маками также прекрасно впишется в прихожую и гостиную – там она будет способствовать дружеской и приятной атмосфере между людьми (как между членами семьи, так и между гостями дома).
       •	Маки также очень благоприятно сказываются на отношениях между родителями и детьми, особенно когда дети ведут себя проблемно, находясь в периоде подросткового возраста. Если у вас именно тот случай, тогда повесьте картину с маками в детской комнате или в той части дома, где чаще всего находится ваш ребенок, — это должно помочь скорректировать ваши отношения, наполнив их взаимоуважением и пониманием.
       •	Где размещать картину – решать вам, так как в принципе, её можно располагать в любой зоне помещения, в зависимости от того, какие сферы жизни вы хотите наладить.
       
       Окружайте себя полезными картинами и будьте счастливы!
       `,
       decoration: false
      },
  
]

export default pictures