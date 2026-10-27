# Build Plan

Ordered list of planned feature units for the project.

## Completed Units

- ✅ Homepage (all sections)
- ✅ Ministries list page
- ✅ Ministry detail page
- ✅ News list page (pagination + filters)
- ✅ News detail page
- ✅ History page (timeline)
- ✅ Architecture cleanup + TypeGen + Lazy-loading

## Upcoming Units

| # | Unit | Description | Dependencies |
|---|------|-------------|--------------|
| 01 | Contact Page | Сторінка контактів з картою, розкладом, формою | Google Maps API key |
| 02 | Hero Unification | Уніфікація заголовних блоків (PageHero) на Новинах та Служіннях | None |
| 03 | Team Page | Сторінка команди (пастор, лідери) | Sanity schema: teamMember |
| 03 | Media/Streams Page | Онлайн-трансляції, відеозаписи | YouTube API integration |
| 04 | About Page | Детальна сторінка «Про нас» | Content from Sanity |
| 05 | Gallery Audit | Унікальні фото для кожного служіння | Sanity content update |

Each unit gets its own spec file in `context/specs/NN-feature-name.md` before implementation begins.
