import qs from 'qs'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Layout from '@/components/Layout'
import EventItem from '@/components/EventItem'
import { API_URL } from '@/config/index'

export default function SearchPage({ events }) {
  const eventArr = events.data
  const router = useRouter()

  const searchTerm = `Search Results for \"${router.query.term}\"`
  
  return (
    <Layout title="Search Results">
        <Link href="/events">Go Back</Link>
      <h1>{searchTerm}</h1>
      {eventArr.length === 0 ? <h3>No event to show</h3> : <></>}
      
      {eventArr.map((evt) => (
        <EventItem key={evt.id} evt={evt.attributes} />
      ))}
    </Layout>
  )
}

export async function getServerSideProps({ query: { term } }) {
    const query = qs.stringify({
        filters: {
            $or: [
                    {name: {$containsi: term} },
                    {performers: {$containsi: term} },
                    {description: {$containsi: term} },
                    {venue: {$containsi: term} }
                // {name_contains: term},
                // {performers_contains: term},
                // {description_contains: term},
                // {venue_contains: term},
            ]
        }
    })

    const res = await fetch(`${API_URL}/api/events?${query}&populate=*`)
    const events = await res.json()
    //_sort=date:ASC&
    return {
        props: { events }
    }
}