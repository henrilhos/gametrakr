import React from "react"
import { Heading } from "../heading"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Dialog,
} from "../ui"

export interface SignUpDialogProps {
  children: React.ReactNode
  open: boolean
  onClose: () => void
}

export const AuthDialog = ({ children, open, onClose }: SignUpDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <Card className="min-h-[100vh] min-w-[100vw] rounded-none px-7 pb-5 pt-20 md:my-8 md:min-h-fit md:min-w-[31rem] md:rounded-[2rem] md:px-14 md:pb-10">
        <CardHeader>
          <CardTitle className="text-left">Join the community</CardTitle>
        </CardHeader>

        <CardContent>{children}</CardContent>

        <CardFooter>
          <Heading size="sm">gametrakr</Heading>
        </CardFooter>
      </Card>
    </Dialog>
  )
}
