import { GetStartedContainer, Navbar } from '@/components'

export default function Home() {
  return (
    <>
      <Navbar />
      <main className='px-16 pb-16'>
        <GetStartedContainer
          game={{
            name: 'Starfield',
            year: '2023',
            image: 'https://i.imgur.com/vKPeDY5.png',
          }}
        />
      </main>
    </>
  )
}
