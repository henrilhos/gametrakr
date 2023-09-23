package mail

import (
	"github.com/henrilhos/gametrakr/utils"
	"github.com/sendgrid/sendgrid-go"
	"github.com/sendgrid/sendgrid-go/helpers/mail"
	"github.com/sirupsen/logrus"
)

type MailService interface {
	SendMail(mailReq *Mail) error
	NewMail(from string, to []string, subject string, mailType MailType, data *MailData) *Mail
}

type MailType int

const (
	MailConfirmation MailType = iota + 1
	PassReset
)

type MailData struct {
	Username string
	Code     string
}

type MailTo struct {
	User  string
	Email string
}

type Mail struct {
	To         MailTo
	Type       MailType
	Data       *MailData
	TemplateID string
}

type SGMailService struct {
	ApiKey    string
	FromEmail string
}

func NewSGMailService() *SGMailService {
	apiKey := utils.GetenvString("SENDGRID_API_KEY")
	fromEmail := utils.GetenvString("SENDGRID_MAIL")

	return &SGMailService{
		ApiKey:    apiKey,
		FromEmail: fromEmail,
	}
}

func (ms *SGMailService) NewMail(to MailTo, mailType MailType, data *MailData, templateID string) *Mail {
	return &Mail{
		To:         to,
		Type:       mailType,
		Data:       data,
		TemplateID: templateID,
	}
}

func (ms *SGMailService) SendMail(mailReq *Mail) error {
	client := sendgrid.NewSendClient(ms.ApiKey)
	message := ms.createMessage(mailReq)

	_, err := client.Send(message)
	if err != nil {
		logrus.Error("unable to send mail", "error", err)
		return err
	}

	logrus.Info("mail sent successfully")
	return nil
}

func (ms *SGMailService) createMessage(mailReq *Mail) *mail.SGMailV3 {
	from := mail.NewEmail("gametrakr team", ms.FromEmail)
	to := mail.NewEmail(mailReq.To.User, mailReq.To.Email)

	message := mail.NewV3Mail()
	message.SetFrom(from)
	message.AddPersonalizations(ms.createPersonalization(to, mailReq.Data))
	message.SetTemplateID(mailReq.TemplateID)

	return message
}

func (ms *SGMailService) createPersonalization(to *mail.Email, data *MailData) *mail.Personalization {
	p := mail.NewPersonalization()
	p.AddTos(to)
	p.SetDynamicTemplateData("username", data.Username)
	p.SetDynamicTemplateData("code", data.Code)

	return p
}
