import { Heading } from "./heading"
import { Button, Card, Container } from "./ui"

export const ImageContainer = () => {
  const getTitleAndYear = () => {
    return `Starfield (2023)`.toUpperCase()
  }

  return (
    <Container>
      <Card
        className="full-height flex h-fit max-w-full flex-col justify-between rounded-2xl bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url(https://i.imgur.com/bNNed9d.png)" }}
      >
        {/* TODO: add link to game page */}
        <div className="ml-4 mt-4 text-background">{getTitleAndYear()}</div>

        <div className="flex flex-col items-center">
          <Card className="mx-8 my-12 max-w-screen-md p-8 md:mx-0 md:px-20 md:py-12">
            <Heading size="lg">Track your gaming journey</Heading>

            <div className="mt-8 text-center text-xl text-muted">
              Show what games you love, share your thoughts and experiences and
              connect with a thriving gaming community.
            </div>

            <div className="mt-16 text-center">
              <Button size="lg" align="center">Get started</Button>
            </div>
          </Card>
        </div>
      </Card>
    </Container>
  )
}
