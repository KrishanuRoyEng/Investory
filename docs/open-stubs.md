# Open API Stubs & Deferred Features

The following features and endpoints are documented in the SRS but have been explicitly deferred from the initial implementation phase.

- **Phase 5 (Live Sessions)**: True automated integration with Agora Cloud Recording (webhooks + BullMQ) is deferred. The MVP supports manual recording URL entry via `POST /admin/live-sessions/:id/recording`.
- **Phase 6 (Webinars)**: True automated webinar recording auto-attach is deferred. The MVP supports manual recording URL entry via `POST /admin/webinars/:id/recording`.
