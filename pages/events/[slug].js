import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {FaPencilAlt, FaTimes} from 'react-icons/fa'
import Layout from '@/components/Layout'
import Link from 'next/link'
import Image from 'next/image'
import { API_URL } from '@/config/index'
import styles from "@/styles/Event.module.css"
import { useRouter } from 'next/router';

export default function EventPage({ evt }) {
  const router = useRouter()

  const deleteEvent = async (e) => {
    if(confirm('Are you sure?')){
      const res = await fetch(`${API_URL}/api/events/${evt.id}`,{
        method: 'DELETE',
      })

      const data = await res.json()

      if(!res.ok){
        toast.error(data.message)
      } else {
        router.push('/events')
      }
    }
  }
  // console.log(evt.image.data.attributes.formats)

  return (
    <Layout>
      <div className={styles.event}>
        <div className={styles.controls}>
          <Link href={`/events/edit/${evt.id}`}>
            <a>
              <FaPencilAlt />Edit Event
            </a>
          </Link>
          <a href='#' className={styles.delete} onClick={deleteEvent}>
            <FaTimes /> Delete Event
          </a>
        </div>

        <span>
          {new Date(evt.attributes.date).toLocaleDateString('en-US')} at {evt.attributes.time}
        </span>
        <h1>{evt.name}</h1>
        <ToastContainer />
        {evt.attributes.data && evt.attributes.image.data && evt.image.data.attributes.formats.medium && (
          <div className={styles.image}>
            <Image src={evt.attributes.image.data.attributes.formats.medium.url} width={960} height={600}/>
          </div>
        )}

        <h3>Performers</h3>
        <p>{evt.attributes.performers}</p>
        <h3>Description:</h3>
        <p>{evt.attributes.description}</p>
        <h3>Venue: {evt.venue}</h3>
        <p>{evt.attributes.address}</p>

        <Link href='/events'>
          <a className={styles.back}>{'<'} Go Back</a>
        </Link>
      </div>
    </Layout>
  )
}

// Fetches at build time but needs getStaticPaths
export async function getStaticPaths(){
  const res = await fetch(`${API_URL}/api/events`)
  const events = await res.json()
  // const events = JSON.stringify(res)

  const paths = events.data.map(evt => ({
    params: {slug: evt.attributes.slug}
  }))

  return {
    paths,
    fallback: true,
  }
}

// Fetches at build time but needs getStaticPaths
export async function getStaticProps( {params: { slug } } ){
  const res = await fetch(`${API_URL}/api/events?filters[slug]=${slug}&populate=*`)
  const events = await res.json()

  return {
    props: {
      evt: events.data[0]
    },
    revalidate: 1
  }
}

// Fetches when activated
// export async function getServerSideProps( {query: {slug} } ){
//   const res = await fetch(`${API_URL}/api/events/${slug}`)
//   const events = await res.json()

//   return {
//     props: {
//       evt: events[0]
//     },
//   }
// }