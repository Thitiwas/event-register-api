BEGIN;


CREATE TABLE IF NOT EXISTS public."Events"
(
    "eventID" integer NOT NULL DEFAULT nextval('"Events_eventID_seq"'::regclass),
    name text COLLATE pg_catalog."default",
    descriptions text COLLATE pg_catalog."default",
    location text COLLATE pg_catalog."default",
    "locationName" text COLLATE pg_catalog."default",
    "eventDate" timestamp with time zone,
    "startRegisterAt" timestamp with time zone,
    "endRegisterAt" timestamp with time zone,
    "seatColumn" integer,
    "totalSeat" integer,
    availableseat integer,
    "seatPerUser" integer,
    status text COLLATE pg_catalog."default",
    "updatedBy" jsonb,
    "createdBy" integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT "Events_pkey" PRIMARY KEY ("eventID")
);

CREATE TABLE IF NOT EXISTS public."Seats"
(
    "seatID" integer NOT NULL DEFAULT nextval('"Seats_seatID_seq"'::regclass),
    "seatNumber" integer,
    firstname text COLLATE pg_catalog."default",
    surname text COLLATE pg_catalog."default" DEFAULT ''::text,
    email text COLLATE pg_catalog."default" DEFAULT ''::text,
    phone text COLLATE pg_catalog."default" DEFAULT ''::text,
    status text COLLATE pg_catalog."default",
    "bookedByAdmin" boolean,
    "eventID" integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT "Seats_pkey" PRIMARY KEY ("seatID")
);

CREATE TABLE IF NOT EXISTS public."Tokens"
(
    "tokenID" integer NOT NULL DEFAULT nextval('"Tokens_tokenID_seq"'::regclass),
    token character varying(255) COLLATE pg_catalog."default",
    status character varying(255) COLLATE pg_catalog."default",
    "userID" integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT "Tokens_pkey" PRIMARY KEY ("tokenID")
);

CREATE TABLE IF NOT EXISTS public."Users"
(
    "userID" integer NOT NULL DEFAULT nextval('"Users_userID_seq"'::regclass),
    name character varying(255) COLLATE pg_catalog."default",
    username character varying(255) COLLATE pg_catalog."default",
    password character varying(255) COLLATE pg_catalog."default",
    status character varying(255) COLLATE pg_catalog."default",
    role character varying(255) COLLATE pg_catalog."default",
    "createdBy" integer,
    "updatedBy" integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT "Users_pkey" PRIMARY KEY ("userID")
);

ALTER TABLE IF EXISTS public."Events"
    ADD CONSTRAINT "Events_createdBy_fkey" FOREIGN KEY ("createdBy")
    REFERENCES public."Users" ("userID") MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public."Seats"
    ADD CONSTRAINT "Seats_eventID_fkey" FOREIGN KEY ("eventID")
    REFERENCES public."Events" ("eventID") MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;


ALTER TABLE IF EXISTS public."Tokens"
    ADD CONSTRAINT "Tokens_userID_fkey" FOREIGN KEY ("userID")
    REFERENCES public."Users" ("userID") MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE NO ACTION;

END;