import { Meta, StoryObj } from "@storybook/react"
import { Heading } from "../heading"
import { Button } from "./button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card"
import { Input } from "./input"

const meta = {
  title: "gametrakr/ui/Card",
  component: Card,
  decorators: [
    (Story) => (
      <div style={{ backgroundColor: "#121212", padding: "1rem" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Card className="h-[45rem] w-[31rem] rounded-[2rem] px-14 py-10">
      <CardHeader>
        <CardTitle>Reset password</CardTitle>
        <CardDescription>
          We&apos;ll send a verification code to your inbox with a link to reset
          your password. Enter your account&apos;s email or nickname below.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <Input label="Email or Nickname" />
          </div>
          <div className="mt-6">
            <Button className="w-full">Send code</Button>
          </div>
        </form>
      </CardContent>

      <CardFooter>
        <Heading size="sm">gametrakr</Heading>
      </CardFooter>
    </Card>
  ),
}
