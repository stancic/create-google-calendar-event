# Create Google Calendar Event Action

This action creates a Google Calendar event with title and description that you
pass as props. This action uses the Google Calendar API to create the event.
It's useful for creating events in a calendar when a certain action is
triggered. For example I've created it for a purpose of creating a calendar
event when a new release is published.

Always try to use the latest major version release of this action.

## Inputs

### `service_account_client_email`

**Required** The email of the service account that will create the event created
in the Google Cloud Console. This is something that I pass as a secret in the
GitHub repository.

### `service_account_client_private_key`

**Required** Private key of the service account that will create the event.
Created in the Google Cloud Console. This is something that I pass as a secret
in the GitHub repository.

### `calendar_id`

**Required** The id of the calendar where the event will be created. You can
find it in the calendar settings. This is something that I pass as a secret in
the GitHub repository.

### `summary`

**Required** The title of the event. It's called summary in the Google Calendar
API.

### `description`

**Required** The description of the event.

## Outputs

### `event_link`

The link to the created event which leads you to the calendar directly.

## Example usage

```yaml
---
uses: actions/create-google-calendar-event@v1
with:
  service_account_client_email: ${{ secrets.SERVICE_ACCOUNT_CLIENT_EMAIL }}
  service_account_client_private_key:
    ${{ secrets.SERVICE_ACCOUNT_CLIENT_PRIVATE_KEY }}
  calendar_id: ${{ secrets.GOOGLE_CALENDAR_ID }}
  summary: ${{ github.event.release.name }}
  description: ${{ github.event.release.body }}
```

### Disclaimer

Please set up the service account properly and make sure that the service
account has the right permissions to create events in the calendar. This action
is not responsible for any misuse of the service account.
