import { useEffect, useRef, useState } from "react";

export default function TestPage() {
  const ref = useRef(null);

  useEffect(() => {
    ref.current.scrollTop = ref.current.scrollHeight;
  }, []);

  const [messages, setMessages] = useState([
    {
      message: "Привет",
      user: "628e5aab0153706a3e18fe79",
      name: "Yaroslav Almazoff",
      date: "23.07.2024 12:00",
      avatar: "907d4938-52fa-4c48-a421-6245c7f2d453.jpg",
      images: [
        "37d5055a-aea0-4397-b640-6d06b8d8a497.jpg",
        "3ff98630-d038-4093-878f-69232741e273.jpg",
      ],
      videos: ["video1.mp4", "video2.mp4"],
    },
    {
      message: "Привет",
      user: "628e5aab0153706a3e18fe79",
      name: "Yaroslav Almazoff",
      date: "23.07.2024 12:00",
      avatar: "907d4938-52fa-4c48-a421-6245c7f2d453.jpg",
      images: [
        "37d5055a-aea0-4397-b640-6d06b8d8a497.jpg",
        "3ff98630-d038-4093-878f-69232741e273.jpg",
      ],
      videos: ["video1.mp4", "video2.mp4"],
    },
  ]);

  return (
    <div style={{ height: "500px" }}>
      <div style={{ height: "500px", overflow: "scroll" }} ref={ref}>
        <p style={{ fontSize: "16pt" }}>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Id dolores
          facilis delectus quibusdam, nam illo nostrum quae accusamus quo
          temporibus distinctio dignissimos eum officiis error blanditiis, culpa
          maiores? Ipsa ea maxime corporis quos vitae assumenda, magnam commodi
          maiores quod dicta nemo quasi, aperiam iusto eligendi veritatis odio
          harum doloribus deserunt officiis dolores ex soluta quae. Dolorum
          deserunt quasi aliquid tempora ipsa vitae placeat accusamus quos.
          Beatae facilis obcaecati voluptate, explicabo officia ea numquam
          minima omnis impedit blanditiis odio ipsam mollitia cupiditate
          repudiandae ut nam, neque cum enim repellat fugiat adipisci? Aliquam
          perferendis reprehenderit cupiditate ex nulla earum deleniti enim sint
          magnam repellendus aut optio, pariatur dolore debitis quisquam rerum,
          reiciendis magni rem nihil, molestiae amet ab nisi. Odit qui
          praesentium animi, corporis illum quisquam odio alias accusamus
          dolorum, nulla neque quam est omnis a deserunt eligendi minima vel
          voluptates id reiciendis voluptatem numquam illo dolore enim?
          Dignissimos explicabo error aut odit aperiam beatae accusantium, cum
          ea sint iure dolore, aliquam praesentium consectetur quaerat placeat?
          Omnis ratione officiis odit totam, est corrupti velit animi corporis
          repellat recusandae autem, at facere! Quia doloribus sapiente fugiat
          veritatis voluptatibus est officiis culpa consectetur dolorum magnam
          eos provident nihil molestiae expedita, quibusdam consequatur earum
          minima exercitationem cumque architecto eaque ducimus. Voluptatem
          quia, et voluptate ad animi neque aliquam ab quibusdam corporis vitae
          consectetur autem, ducimus voluptates labore aperiam ex laudantium
          commodi, eius dicta hic vero vel alias quam! Ipsam expedita neque,
          officia praesentium, aliquid porro sunt vel aliquam eaque quasi ullam.
          Aperiam voluptatum fuga repellat saepe laudantium architecto dolor
          quibusdam natus molestias sit quae quo cum, assumenda itaque dolore
          quas beatae aut incidunt sint laborum, earum neque ea! Ipsam velit
          praesentium, a in aliquid dolorem itaque reprehenderit eveniet cumque
          amet voluptatum corrupti dolor adipisci officiis? Fuga quia
          necessitatibus officiis, recusandae et expedita officia nam excepturi
          corrupti sunt beatae explicabo quaerat voluptate aut delectus
          adipisci. Similique, distinctio harum laborum sed accusantium odio
          eius consequatur. Ipsa nemo consequatur culpa eos quod hic.
          Perferendis dolore error necessitatibus perspiciatis, rerum expedita
          ullam totam dicta incidunt saepe eum, itaque tenetur eligendi
          reprehenderit, corporis non explicabo omnis porro nulla debitis
          asperiores sint. Animi porro nihil temporibus reprehenderit placeat
          neque, excepturi minus dolores? Quos voluptates atque expedita
          voluptas voluptate ad doloremque animi obcaecati omnis, distinctio
          maiores hic cum quisquam ullam ex architecto velit dolor est illum.
          Necessitatibus ipsa explicabo sit quasi iusto facere sint laborum
          cupiditate facilis architecto praesentium illum quidem aut autem odio
          quam debitis et, ducimus harum rerum fuga quia, iure at suscipit. Ea
          facere nostrum assumenda? Natus deleniti maxime consequatur saepe
          delectus eius consequuntur facere, ut hic nisi quis corrupti provident
          quidem laudantium molestiae. Sequi quas minima impedit, voluptas culpa
          amet fuga dolorum dicta eius tempora error. Exercitationem, at
          delectus iure voluptate, et, nemo aliquid reiciendis vero id
          temporibus debitis repellendus dolorem hic. Quae est quibusdam animi
          molestiae voluptate placeat consequuntur quam nisi iusto voluptatum,
          illum, recusandae corrupti eum debitis labore, obcaecati laudantium?
          Eaque numquam eveniet nobis necessitatibus! Distinctio optio delectus
          beatae perspiciatis autem voluptatum earum? Ab, eveniet! Eveniet,
          provident. Sit, id deleniti rem eum ut aliquam cum recusandae nisi
          pariatur distinctio commodi perspiciatis sunt vero esse ratione
          maiores omnis aut itaque quos veritatis, officia hic tempore eius
          minima! Accusamus, autem. Praesentium ut consequuntur excepturi
          repellendus voluptates minima autem fuga reiciendis commodi maiores
          quis velit perferendis reprehenderit nihil totam ducimus, suscipit
          eveniet aut architecto labore sed natus maxime cum expedita? Delectus,
          maiores. Ex dolorem iusto sint nulla quod non consectetur ullam
          repellat, minima nobis itaque repudiandae, at sunt tenetur accusantium
          velit aspernatur mollitia minus natus voluptas accusamus libero
          fugiat, suscipit autem? Esse, nam perferendis nesciunt doloribus ea
          accusantium a facere deserunt delectus deleniti sapiente iste fugit
          adipisci et eum veritatis fuga soluta cum nisi dolorum voluptatum in
          vel? Minus harum quo iusto nobis! Sint animi iure esse et voluptates
          earum obcaecati doloribus voluptate provident, ullam odio sit
          accusamus sapiente soluta quidem voluptatum nisi eaque facilis dolor
          tempore consequatur tempora? Quisquam cum consequatur alias eum ad
          dolores id! Sunt praesentium esse libero, accusamus possimus nihil
          vero facilis, modi nesciunt est, similique beatae velit odit? Possimus
          architecto ducimus nesciunt nemo distinctio natus, est a voluptas cum
          obcaecati. Nemo laboriosam natus fuga, totam non quos sint esse
          recusandae maxime, expedita debitis nihil quasi quod? Sit assumenda,
          debitis, cupiditate consectetur autem similique rerum explicabo
          laboriosam laborum necessitatibus sed quam obcaecati repudiandae. Vero
          dolorem mollitia incidunt rerum, quaerat et, amet, temporibus
          molestiae recusandae distinctio rem eligendi deleniti sunt harum ipsam
          dicta saepe repudiandae cupiditate velit quas maxime nihil officiis
          beatae pariatur. Voluptatum ullam eius voluptates magni assumenda eum
          porro repellat corrupti qui aliquid! Dignissimos eum ipsam accusamus
          ut, doloremque facere labore pariatur recusandae. Animi, quod qui,
          repellat accusamus illum provident praesentium vel quos sed aut ad
          dicta suscipit amet. Voluptas maxime deleniti aut dolore quibusdam
          doloremque non officiis rerum odit? Aliquid deleniti dolor atque nemo
          corrupti amet incidunt quia dicta beatae dignissimos. Corporis
          doloribus quod modi amet ducimus itaque molestias accusamus aliquid ab
          voluptatum, maxime fugit aspernatur reiciendis voluptatibus earum,
          ullam necessitatibus! Perspiciatis a aliquam eligendi iste distinctio!
          Iste illum incidunt iure culpa corporis at deserunt molestias earum
          quia fuga, laboriosam quidem aut molestiae. Dignissimos distinctio,
          non molestiae dicta eligendi amet, fugiat, expedita iste dolorum esse
          ratione officiis assumenda ad. Voluptate vitae nisi iste quibusdam ab
          rem eveniet similique. Cumque asperiores cupiditate voluptatum,
          architecto eos repudiandae veritatis nam modi quia ratione, quaerat
          quo atque autem? Eos unde, ipsa, temporibus reiciendis eveniet eaque
          error molestiae officiis incidunt minus enim quo repellat! Nesciunt
          consectetur saepe atque, tempore, accusamus tempora veniam eveniet sit
          voluptatibus aut consequatur hic, rerum neque. Dolor officiis fugit
          hic quasi minima ut quaerat molestias? Ex vel odit, adipisci alias
          expedita in cupiditate id modi. In dolores modi nam deserunt quibusdam
          maxime quam repudiandae sit distinctio eveniet? Odio incidunt numquam
          pariatur necessitatibus enim quas sit recusandae expedita corrupti ea
          ipsum dignissimos eligendi nostrum aliquid est aspernatur, similique
          quasi. Perferendis, quia iste? Reprehenderit porro provident expedita
          cum atque beatae rem sint eos facere, officia voluptates maiores alias
          rerum suscipit laboriosam quia, harum recusandae, modi saepe?
        </p>
      </div>
    </div>
  );
}
