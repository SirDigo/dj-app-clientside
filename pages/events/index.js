import Layout from '@/components/Layout'
import EventItem from '@/components/EventItem'
import { API_URL, PER_PAGE } from '@/config/index'
import Pagination from '@/components/Pagination'


export default function EventPage({events, page, total}) {

  console.log(total)

  const eventArr = events.data

  return (
    <Layout>
      <h1>Events</h1>
      {eventArr.length === 0 ? <h3>No event to show</h3> : <></>}
      
      {eventArr.map((evt) => (
        <EventItem key={evt.id} evt={evt.attributes} />
      ))}

      <Pagination page={page} total={total}/>
    </Layout>
  )
}

export async function getServerSideProps({query: {page = 1}}) {
  //Calculate start page
  const start = +page === 1 ? 0 : (+page -1) * PER_PAGE

  //Fetch total
  const totalRes = await fetch(`${API_URL}/api/events/count`)
  const total = await totalRes.json()

  //Fetch events
  const eventRes = await fetch(`${API_URL}/api/events?populate=*&sort[date]=asc&pagination[limit]=${PER_PAGE}&pagination[start]=${start}`)
  const events = await eventRes.json()

  return {
    props: { events, page: +page, total },
  }
}