import Layout from '@/components/Layout'
import EventItem from '@/components/EventItem'
import Link from 'next/link'
import { API_URL } from '@/config/index'

export default function HomePage({events}) {
  const eventArr = events.data

  return (
    <Layout>
      <h1>Upcoming Events</h1>
      {eventArr.length === 0 ? <h3>No event to show</h3> : <></>}
      
      {eventArr.map((evt) => (
        //Needs to be destructured.
        <EventItem key={evt.id} evt={evt.attributes} />
      ))}

      {eventArr.length > 0 && (
        <Link href="/events" >
          <a className='btn-secondary'>View All Events</a>
        </Link>
      )}
    </Layout>
  )
}

export async function getStaticProps() {
  const res = await fetch(`${API_URL}/api/events?populate=*&sort[date]=asc&pagination[limit]=3`)
  const events = await res.json()

  return {
    props: { events },
    revalidate: 1, //revalidate every 1 second if data is changed
  }
}