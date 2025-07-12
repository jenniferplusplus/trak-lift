import {ManageExercises} from "./elements/manage-exercises.js";
import {ManageRoutines} from "./elements/mange-routines.js";
import {RoutineListWidget} from "./elements/routine-list-widget.js";
import {SessionListWidget} from "./elements/session-list-widget.js";
import {SingleExercise} from "./elements/single-exercise.js";
import {SingleRoutine} from "./elements/single-routine.js";
import {TrakHeader} from "./elements/trak-header.js";

import {Home} from "./views/home.js";
import {AboutView} from "./views/about.js";
import {SingleSession} from "./views/single-session.js";
import {ManageSessions} from "./views/manage-sessions.js";

window.customElements.define('manage-exercises', ManageExercises);
window.customElements.define('manage-routines', ManageRoutines);
window.customElements.define('routine-list-widget', RoutineListWidget);
window.customElements.define('session-list-widget', SessionListWidget);
window.customElements.define('single-exercise', SingleExercise);
window.customElements.define('single-routine', SingleRoutine);
window.customElements.define('home-view', Home);
window.customElements.define('about-view', AboutView);
window.customElements.define('trak-header', TrakHeader)
window.customElements.define('single-session', SingleSession);
window.customElements.define('manage-sessions', ManageSessions);
