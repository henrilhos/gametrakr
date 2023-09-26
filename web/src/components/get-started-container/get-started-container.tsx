import { Button } from '../button'
import { Title } from '../title'

type GameContainerInfo = {
  name: string
  year: string
  image: string
}

type Props = {
  game: GameContainerInfo
}

export const GetStartedContainer = ({ game }: Props) => {
  const getTitleAndYear = () => {
    return `${game.name} (${game.year})`.toUpperCase()
  }

  return (
    <div
      className='home-container flex h-fit max-w-full flex-col justify-between rounded-2xl'
      style={{
        backgroundImage: `url(${game.image})`,
      }}
    >
      {/* TODO: add link to game page */}
      <div className='ml-4 mt-4 text-white'>{getTitleAndYear()}</div>

      <div className='flex flex-col items-center'>
        <div className='mx-8 my-12 max-w-screen-md rounded-2xl bg-white p-8 dark:bg-black md:mx-0 md:px-20 md:py-12'>
          <Title>Track your gaming journey</Title>

          <h2 className='text-black-lighter mt-8 text-center text-xl dark:text-gray-400'>
            Show what games you love, share your thoughts and experiences and
            connect with a thriving gaming community.
          </h2>

          <div className='mt-16 text-center'>
            <Button classes='min-w-[13rem] text-center'>Get started</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
