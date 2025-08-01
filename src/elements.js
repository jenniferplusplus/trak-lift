import {ManageExercises} from "./elements/manage-exercises.js";
import {RoutinesView} from "./views/routines-view.js";
import {RoutineListWidget} from "./elements/routine-list-widget.js";
import {SessionListWidget} from "./elements/session-list-widget.js";
import {SingleExercise} from "./elements/single-exercise.js";
import {SingleRoutineView} from "./views/single-routine-view.js";
import {TrakHeader} from "./elements/trak-header.js";

import {Home} from "./views/home.js";
import {AboutView} from "./views/about.js";
import {SingleSession} from "./views/single-session.js";
import {ManageSessions} from "./views/manage-sessions.js";

window.customElements.define('manage-exercises', ManageExercises);
window.customElements.define('manage-routines', RoutinesView);
window.customElements.define('routine-list-widget', RoutineListWidget);
window.customElements.define('session-list-widget', SessionListWidget);
window.customElements.define('single-exercise', SingleExercise);
window.customElements.define('single-routine', SingleRoutineView);
window.customElements.define('home-view', Home);
window.customElements.define('about-view', AboutView);
window.customElements.define('trak-header', TrakHeader)
window.customElements.define('single-session', SingleSession);
window.customElements.define('manage-sessions', ManageSessions);
