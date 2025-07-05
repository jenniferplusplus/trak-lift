# Trak Lift

This app exists because I wanted an easy-to-use digital activity tracker.
There are lots of those, but it's basically impossible to find one that's not stalking you, harvesting every
last scrap of data it can about you, and selling it to autocrats and billionaires.
Or they try to hard sell you on slop-filled personal training.
Most of them do both.

## Features
- [x] Simple exercise tracker
- [x] Reusable routines
- [x] Exercise history
- [x] Zero stalking
- [ ] Offline-first Progressive Web App
- [ ] Progress analytics
- [ ] Better, more guided onboarding and workflow
- [ ] Reorder exercises
- [ ] Data export/import

## Design

This is a modern, lightweight single page web app.
It was built as a weekend project, so it's not the _best_ software engineering.
But, it should still be pretty usable, performant, and accessible.
It's based on web components, and makes extensive use of IndexedDB.

### Technologies

- [Lit web components][lit]
- [idb IndexedDB support][idb]
- [Navigo client router][navigo]
- [Pico CSS][pico]
- [Vite module bundler][vite]

## Contributing

I consider this app to be at a minimum viable level, for my needs.
I'll likely continue to tinker with it occasionally, but I'm not in any hurry.
If it seems useful to you, and you'd like to contribute, you are more than welcome.
If you do make a contribution, you are doing so under the same license terms as the project.

Mobile is the most important form factor for this project.
It needs to be convenient to use one-handed during a workout session.
Keep that in mind as you're working, and check things in a mobile view often.

### Dev Process

1. Get the dependencies and run the project
```shell
npm install
npm test
npm run dev
```

2. Open an issue to discuss your plans
3. Make your desired changes
4. Try to leave things better than you found them
    - Add tests for your changes
    - Refactor when needed
    - etc
5. Submit a PR
   - Include some description
   - Screenshots are good


[lit]: https://lit.dev
[idb]: https://github.com/jakearchibald/idb
[navigo]: https://github.com/krasimir/navigo
[pico]: https://picocss.com/
[vite]: https://vite.dev/