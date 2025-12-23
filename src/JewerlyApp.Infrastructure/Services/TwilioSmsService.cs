using JewerlyApp.Application.Interfaces;
using JewerlyApp.Infrastructure.Settings;
using Microsoft.Extensions.Options;
using Twilio;
using Twilio.Rest.Api.V2010.Account;
using Twilio.Types;

public class TwilioSmsService : ISmsService
{
    private readonly TwilioSettings _settings;

    public TwilioSmsService(IOptions<TwilioSettings> options)
    {
        _settings = options.Value;

        TwilioClient.Init(_settings.AccountSid, _settings.AuthToken);
    }

    public async Task SendAsync(string toPhoneNumber, string message)
    {
        await MessageResource.CreateAsync(
            body: message,
            from: new PhoneNumber(_settings.FromNumber),
            to: new PhoneNumber(toPhoneNumber)
        );
    }
}
