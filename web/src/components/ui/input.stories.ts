import { Meta, StoryObj } from "@storybook/react"
import { Input } from "./input"

const meta = {
  title: "gametrakr/ui/Input",
  component: Input,
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    label: "Email",
  },
}
