import Layout from '@/components/Layout'
import EventItem from '@/components/EventItem'
import { API_URL } from '@/config/index'

export default function EventPage({events}) {
  const eventArr = events.data

  // console.log(events)
  return (
    <Layout>
      <h1>Events</h1>
      {eventArr.length === 0 ? <h3>No event to show</h3> : <></>}
      
      {eventArr.map((evt) => (
        <EventItem key={evt.id} evt={evt.attributes} />
      ))}
    </Layout>
  )
}

export async function getStaticProps() {
  const res = await fetch(`${API_URL}/api/events?populate=*&sort[date]=asc`)
  const events = await res.json()
//_sort=date:ASC&
  return {
    props: { events },
    revalidate: 1, //revalidate every 1 second if data is changed
  }
}