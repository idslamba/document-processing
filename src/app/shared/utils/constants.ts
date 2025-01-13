export class SolventekConstants {

    public static MENU_OPEN: any;

    public static MESSAGE_TYPES = {
        ERROR: 1,
        SUCCESS: 2
    }

    public static REPEAT_TYPES = {
        DAILY: 1,
        WEEKLY: 2,
        MONTHLY: 3,
        CUSTOM: 4,
    }

    public static DURATION = 900000;

    public static SCHEDULE_TYPES = {
        'SUBMITTED': 'submitted',
        'ACTIVE': 'active',
        'INACTIVE': 'inactive',
        'COMPLETED': 'completed',
    }

    public static SELECTED_RADIO_TYPES = {
        'ON_DAY': 1,
        "ON_THE": 2
    }

    public static DAY_INDEX = {
        'FIRST': 1,
        'SECOND': 2,
        'THIRD': 3,
        'FOURTH': 4,
        'LAST': 5,
        DAY_INDEX_MAP: new Map().set(1, 'First').set(2, 'Second').set(3, 'Third').set(4, 'Fourth').set(5, 'Last')
    }

    public static DAYS = {
        'SUNDAY': 1,
        'MONDAY': 2,
        'TUESDAY': 3,
        'WEDNESDAY': 4,
        'THURSDAY': 5,
        'FRIDAY': 5,
        'SATURDAY' :6, 
        DAYS_MAP: new Map().set(0,'Sunday').set(1, 'Monday').set(2, 'Tuesday').set(3, 'Wednesday').set(4, 'Thursday').set(5, 'Friday').set(6, 'Saturday')
    }

    public static END_DATE = new Date(2030, 11, 31, 23, 59, 59, 999);



}