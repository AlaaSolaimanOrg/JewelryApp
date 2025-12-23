using JewerlyApp.Application.Interfaces;
using Microsoft.Extensions.Configuration;
using Twilio;
using Twilio.Rest.Api.V2010.Account;

public class TwilioSmsService : ISmsService
{
    private readonly IConfiguration _config;

    public TwilioSmsService(IConfiguration config)
    {
        _config = config;

        TwilioClient.Init(
            _config["Twilio:AccountSid"],
            _config["Twilio:AuthToken"]
        );
    }

    public async Task SendAsync(string toPhoneNumber, string message)
    {
        
        await MessageResource.CreateAsync(
            body: message,
            from: new Twilio.Types.PhoneNumber(_config["Twilio:FromNumber"]),
            to: new Twilio.Types.PhoneNumber(toPhoneNumber)
        );
    }
}
