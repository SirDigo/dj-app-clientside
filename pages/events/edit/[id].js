import moment from 'moment';
import { FaImage } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image';
import Layout from '@/components/Layout'
import { API_URL } from '@/config/index'
import styles from '@/styles/Form.module.css'

export default function EditEventPage({ evt }) {
  const attributes = evt.data.attributes;
  const imageData = attributes.image.data ? attributes.image.data.attributes : null ;

  // console.log(evt)

  const [values, setValues] = useState({
    name: attributes.name,
    performers: attributes.performers,
    venue: attributes.venue,
    address: attributes.address,
    date: attributes.date,
    time: attributes.time,
    description: attributes.description,
  })

  const [imagePreview, setImagePreview] = useState(
    imageData ? imageData.formats.thumbnail.url : null
  )

  const router = useRouter()

  const valuesObj = {data: {...values}}

  const handleSubmit = async (e) => {
    e.preventDefault()

    //Validation
    const hasEmptyFields = Object.values(values).some((element) => element === '')

    if(hasEmptyFields){
      toast.error("Please Fill in all fields")
    }

    const res = await fetch(`${API_URL}/api/events/${evt.data.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(valuesObj)
    })


    if(!res.ok) {
      toast.error("Something Went Wrong")
    } else {
      const evt = await res.json()
      // router.push(`/`)
      toast.success("Event Published!")
    }
  }

  const handleInputChange = (e) => {
    const {name, value} = e.target
    setValues({...values, [name]: value})
  }

  return (
    <Layout title='Add New Event'>
        <Link href="/events">Go Back</Link>
        <h1>Edit Event</h1>
        <ToastContainer />
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.grid}>
            <div>
              <label htmlFor='name'>Event Name</label>
              <input type='text' id='name' name='name' value={values.name} onChange={handleInputChange} />
            </div>
            <div>
              <label htmlFor='performers'>Performers</label>
              <input type='text' id='performers' name='performers' value={values.performers} onChange={handleInputChange} />
            </div>
            <div>
              <label htmlFor='venue'>Venue</label>
              <input type='text' id='venue' name='venue' value={values.venue} onChange={handleInputChange} />
            </div>
            <div>
              <label htmlFor='address'>Address</label>
              <input type='text' id='address' name='address' value={values.address} onChange={handleInputChange} />
            </div>
            <div>
              <label htmlFor='date'>Date</label>
              <input type='date' id='date' name='date' value={moment(values.date).format('yyyy-MM-DD')} onChange={handleInputChange} />
            </div>
                        <div>
              <label htmlFor='time'>Time</label>
              <input type='text' id='time' name='time' value={values.time} onChange={handleInputChange} />
            </div>
          </div>

          <div>
          <div>
              <label htmlFor='description'>Event Description</label>
              <textarea type='text' id='description' name='description' value={values.description} onChange={handleInputChange}></textarea>
            </div>
          </div>
          <input type="submit" value="Update Event" className="btn" />
        </form>
        
        <h2>Event Image</h2>
        {imagePreview ?
          <Image src={imagePreview} height={100} width={170}/>
            : 
          <div>
            <p>No Image Uploaded</p>
          </div>
        }

        <div>
          <button className='btn-secondary'>
            <FaImage /> Set Image
          </button>
        </div>
    </Layout>
  )
}


export async function getServerSideProps({params: {id}}) {
    const res = await fetch(`${API_URL}/api/events/${id}?populate=*`)
    const evt = await res.json()

    return {
        props: {
            evt
        }
    }
}