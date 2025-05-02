import type * as types from './types';
import type { ConfigOptions, FetchResponse } from 'api/dist/core'
import Oas from 'oas';
import APICore from 'api/dist/core';
import definition from './openapi.json';

class SDK {
  spec: Oas;
  core: APICore;

  constructor() {
    this.spec = Oas.init(definition);
    this.core = new APICore(this.spec, 'luma-docs/1.0.0 (api/6.1.3)');
  }

  /**
   * Optionally configure various options that the SDK allows.
   *
   * @param config Object of supported SDK options and toggles.
   * @param config.timeout Override the default `fetch` request timeout of 30 seconds. This number
   * should be represented in milliseconds.
   */
  config(config: ConfigOptions) {
    this.core.setConfig(config);
  }

  /**
   * If the API you're using requires authentication you can supply the required credentials
   * through this method and the library will magically determine how they should be used
   * within your API request.
   *
   * With the exception of OpenID and MutualTLS, it supports all forms of authentication
   * supported by the OpenAPI specification.
   *
   * @example <caption>HTTP Basic auth</caption>
   * sdk.auth('username', 'password');
   *
   * @example <caption>Bearer tokens (HTTP or OAuth 2)</caption>
   * sdk.auth('myBearerToken');
   *
   * @example <caption>API Keys</caption>
   * sdk.auth('myApiKey');
   *
   * @see {@link https://spec.openapis.org/oas/v3.0.3#fixed-fields-22}
   * @see {@link https://spec.openapis.org/oas/v3.1.0#fixed-fields-22}
   * @param values Your auth credentials for the API; can specify up to two strings or numbers.
   */
  auth(...values: string[] | number[]) {
    this.core.setAuth(...values);
    return this;
  }

  /**
   * If the API you're using offers alternate server URLs, and server variables, you can tell
   * the SDK which one to use with this method. To use it you can supply either one of the
   * server URLs that are contained within the OpenAPI definition (along with any server
   * variables), or you can pass it a fully qualified URL to use (that may or may not exist
   * within the OpenAPI definition).
   *
   * @example <caption>Server URL with server variables</caption>
   * sdk.server('https://{region}.api.example.com/{basePath}', {
   *   name: 'eu',
   *   basePath: 'v14',
   * });
   *
   * @example <caption>Fully qualified server URL</caption>
   * sdk.server('https://eu.api.example.com/v14');
   *
   * @param url Server URL
   * @param variables An object of variables to replace into the server URL.
   */
  server(url: string, variables = {}) {
    this.core.setServer(url, variables);
  }

  /**
   * Return admin information about an event that you have manage access for.
   *
   * @summary Get Event
   */
  getPublicV1EventGet(metadata: types.GetPublicV1EventGetMetadataParam): Promise<FetchResponse<200, types.GetPublicV1EventGetResponse200>> {
    return this.core.fetch('/public/v1/event/get', 'get', metadata);
  }

  /**
   * Every event and API key on Luma is managed by a [Luma
   * Calendar](https://help.lu.ma/p/helpart-hJI2JawEcFaH6he/luma-calendar-overview). You can
   * list all of the events managed by your Calendar by using this API route.
   *
   * Note that this API route will not list events that are listed on the Calendar but not
   * managed by the Calendar.
   *
   * @summary List Events
   */
  getPublicV1CalendarListEvents(metadata?: types.GetPublicV1CalendarListEventsMetadataParam): Promise<FetchResponse<200, types.GetPublicV1CalendarListEventsResponse200>> {
    return this.core.fetch('/public/v1/calendar/list-events', 'get', metadata);
  }

  /**
   * Get a guest by their Guest API ID, email or Proxy Key.
   *
   * @summary Get Guest
   */
  getPublicV1EventGetGuest(metadata: types.GetPublicV1EventGetGuestMetadataParam): Promise<FetchResponse<200, types.GetPublicV1EventGetGuestResponse200>> {
    return this.core.fetch('/public/v1/event/get-guest', 'get', metadata);
  }

  /**
   * Get list of guests who have registered or been invited to an event.
   *
   * @summary Get Guests
   */
  getPublicV1EventGetGuests(metadata: types.GetPublicV1EventGetGuestsMetadataParam): Promise<FetchResponse<200, types.GetPublicV1EventGetGuestsResponse200>> {
    return this.core.fetch('/public/v1/event/get-guests', 'get', metadata);
  }

  /**
   * Get Self
   *
   */
  getPublicV1UserGetSelf(): Promise<FetchResponse<200, types.GetPublicV1UserGetSelfResponse200>> {
    return this.core.fetch('/public/v1/user/get-self', 'get');
  }

  /**
   * List Person Tags
   *
   */
  getPublicV1CalendarListPersonTags(metadata?: types.GetPublicV1CalendarListPersonTagsMetadataParam): Promise<FetchResponse<200, types.GetPublicV1CalendarListPersonTagsResponse200>> {
    return this.core.fetch('/public/v1/calendar/list-person-tags', 'get', metadata);
  }

  /**
   * Lookup an entity on Luma by it's slug.
   *
   * @summary Lookup Entity
   */
  getPublicV1EntityLookup(metadata: types.GetPublicV1EntityLookupMetadataParam): Promise<FetchResponse<200, types.GetPublicV1EntityLookupResponse200>> {
    return this.core.fetch('/public/v1/entity/lookup', 'get', metadata);
  }

  /**
   * See if an event already exists on the calendar. This is useful when figuring out if you
   * want to submit an event to the calendar.
   *
   * @summary Lookup Event
   */
  getPublicV1CalendarLookupEvent(metadata: types.GetPublicV1CalendarLookupEventMetadataParam): Promise<FetchResponse<200, types.GetPublicV1CalendarLookupEventResponse200>> {
    return this.core.fetch('/public/v1/calendar/lookup-event', 'get', metadata);
  }

  /**
   * List People
   *
   */
  getPublicV1CalendarListPeople(metadata?: types.GetPublicV1CalendarListPeopleMetadataParam): Promise<FetchResponse<200, types.GetPublicV1CalendarListPeopleResponse200>> {
    return this.core.fetch('/public/v1/calendar/list-people', 'get', metadata);
  }

  /**
   * List all coupons that have been created for an event..
   *
   * @summary List Event Coupons
   */
  getPublicV1EventCoupons(metadata: types.GetPublicV1EventCouponsMetadataParam): Promise<FetchResponse<200, types.GetPublicV1EventCouponsResponse200>> {
    return this.core.fetch('/public/v1/event/coupons', 'get', metadata);
  }

  /**
   * List all coupons that have been created for a calendar.
   *
   * @summary List Calendar Coupons
   */
  getPublicV1CalendarCoupons(metadata?: types.GetPublicV1CalendarCouponsMetadataParam): Promise<FetchResponse<200, types.GetPublicV1CalendarCouponsResponse200>> {
    return this.core.fetch('/public/v1/calendar/coupons', 'get', metadata);
  }

  /**
   * Create Event
   *
   */
  postPublicV1EventCreate(body: types.PostPublicV1EventCreateBodyParam): Promise<FetchResponse<200, types.PostPublicV1EventCreateResponse200>> {
    return this.core.fetch('/public/v1/event/create', 'post', body);
  }

  /**
   * Update Event
   *
   */
  postPublicV1EventUpdate(body: types.PostPublicV1EventUpdateBodyParam): Promise<FetchResponse<200, types.PostPublicV1EventUpdateResponse200>> {
    return this.core.fetch('/public/v1/event/update', 'post', body);
  }

  /**
   * Update Guest Status
   *
   */
  postPublicV1EventUpdateGuestStatus(body: types.PostPublicV1EventUpdateGuestStatusBodyParam): Promise<FetchResponse<200, types.PostPublicV1EventUpdateGuestStatusResponse200>> {
    return this.core.fetch('/public/v1/event/update-guest-status', 'post', body);
  }

  /**
   * Send guest an invite to an event. We will send an email and if there phone number is
   * linked to their Luma account, they will also receive an SMS.
   *
   * @summary Send Invites
   */
  postPublicV1EventSendInvites(body: types.PostPublicV1EventSendInvitesBodyParam): Promise<FetchResponse<200, types.PostPublicV1EventSendInvitesResponse200>> {
    return this.core.fetch('/public/v1/event/send-invites', 'post', body);
  }

  /**
   * Add a guest to the event. They will be added with the status "Going".
   *
   * @summary Add Guests
   */
  postPublicV1EventAddGuests(body: types.PostPublicV1EventAddGuestsBodyParam): Promise<FetchResponse<200, types.PostPublicV1EventAddGuestsResponse200>> {
    return this.core.fetch('/public/v1/event/add-guests', 'post', body);
  }

  /**
   * Name of the host you are adding. If they already have a Luma profile, this will be
   * ignored.
   *
   * @summary Add Host
   */
  postPublicV1EventAddHost(body: types.PostPublicV1EventAddHostBodyParam): Promise<FetchResponse<200, types.PostPublicV1EventAddHostResponse200>> {
    return this.core.fetch('/public/v1/event/add-host', 'post', body);
  }

  /**
   * Create a coupon that can be applied when a guest is registering for an event. You are
   * not able to edit the coupon terms after it has been created.
   *
   * @summary Create Coupon
   */
  postPublicV1EventCreateCoupon(body: types.PostPublicV1EventCreateCouponBodyParam): Promise<FetchResponse<200, types.PostPublicV1EventCreateCouponResponse200>> {
    return this.core.fetch('/public/v1/event/create-coupon', 'post', body);
  }

  /**
   * Update Coupon
   *
   */
  postPublicV1EventUpdateCoupon(body: types.PostPublicV1EventUpdateCouponBodyParam): Promise<FetchResponse<200, types.PostPublicV1EventUpdateCouponResponse200>> {
    return this.core.fetch('/public/v1/event/update-coupon', 'post', body);
  }

  /**
   * Create a coupon that can be applied to any event that is managed by the calendar. Be
   * careful not to have the same code on an event and on the calendar.
   *
   * @summary Create Coupon
   */
  postPublicV1CalendarCouponsCreate(body: types.PostPublicV1CalendarCouponsCreateBodyParam): Promise<FetchResponse<200, types.PostPublicV1CalendarCouponsCreateResponse200>> {
    return this.core.fetch('/public/v1/calendar/coupons/create', 'post', body);
  }

  /**
   * Update Coupon
   *
   */
  postPublicV1CalendarCouponsUpdate(body: types.PostPublicV1CalendarCouponsUpdateBodyParam): Promise<FetchResponse<200, types.PostPublicV1CalendarCouponsUpdateResponse200>> {
    return this.core.fetch('/public/v1/calendar/coupons/update', 'post', body);
  }

  /**
   * Import people to your calendar to easily invite them to events and send them
   * newsletters.
   *
   * @summary Import People
   */
  postPublicV1CalendarImportPeople(body: types.PostPublicV1CalendarImportPeopleBodyParam): Promise<FetchResponse<200, types.PostPublicV1CalendarImportPeopleResponse200>> {
    return this.core.fetch('/public/v1/calendar/import-people', 'post', body);
  }

  /**
   * Create Person Tag
   *
   */
  postPublicV1CalendarCreatePersonTag(body: types.PostPublicV1CalendarCreatePersonTagBodyParam): Promise<FetchResponse<200, types.PostPublicV1CalendarCreatePersonTagResponse200>> {
    return this.core.fetch('/public/v1/calendar/create-person-tag', 'post', body);
  }

  /**
   * Update Person Tag
   *
   */
  postPublicV1CalendarUpdatePersonTag(body: types.PostPublicV1CalendarUpdatePersonTagBodyParam): Promise<FetchResponse<200, types.PostPublicV1CalendarUpdatePersonTagResponse200>> {
    return this.core.fetch('/public/v1/calendar/update-person-tag', 'post', body);
  }

  /**
   * Delete Person Tag
   *
   */
  postPublicV1CalendarDeletePersonTag(body: types.PostPublicV1CalendarDeletePersonTagBodyParam): Promise<FetchResponse<200, types.PostPublicV1CalendarDeletePersonTagResponse200>> {
    return this.core.fetch('/public/v1/calendar/delete-person-tag', 'post', body);
  }

  /**
   * Add an existing event (on Luma or on an external platform) to the Luma calendar. This
   * will _not_ make the event managed by the calendar.
   *
   * @summary Add Event
   */
  postPublicV1CalendarAddEvent(body: types.PostPublicV1CalendarAddEventBodyParam): Promise<FetchResponse<200, types.PostPublicV1CalendarAddEventResponse200>> {
    return this.core.fetch('/public/v1/calendar/add-event', 'post', body);
  }

  /**
   * Create Upload URL
   *
   */
  postPublicV1ImagesCreateUploadUrl(body: types.PostPublicV1ImagesCreateUploadUrlBodyParam): Promise<FetchResponse<200, types.PostPublicV1ImagesCreateUploadUrlResponse200>> {
    return this.core.fetch('/public/v1/images/create-upload-url', 'post', body);
  }
}

const createSDK = (() => { return new SDK(); })()
;

export default createSDK;

export type { GetPublicV1CalendarCouponsMetadataParam, GetPublicV1CalendarCouponsResponse200, GetPublicV1CalendarListEventsMetadataParam, GetPublicV1CalendarListEventsResponse200, GetPublicV1CalendarListPeopleMetadataParam, GetPublicV1CalendarListPeopleResponse200, GetPublicV1CalendarListPersonTagsMetadataParam, GetPublicV1CalendarListPersonTagsResponse200, GetPublicV1CalendarLookupEventMetadataParam, GetPublicV1CalendarLookupEventResponse200, GetPublicV1EntityLookupMetadataParam, GetPublicV1EntityLookupResponse200, GetPublicV1EventCouponsMetadataParam, GetPublicV1EventCouponsResponse200, GetPublicV1EventGetGuestMetadataParam, GetPublicV1EventGetGuestResponse200, GetPublicV1EventGetGuestsMetadataParam, GetPublicV1EventGetGuestsResponse200, GetPublicV1EventGetMetadataParam, GetPublicV1EventGetResponse200, GetPublicV1UserGetSelfResponse200, PostPublicV1CalendarAddEventBodyParam, PostPublicV1CalendarAddEventResponse200, PostPublicV1CalendarCouponsCreateBodyParam, PostPublicV1CalendarCouponsCreateResponse200, PostPublicV1CalendarCouponsUpdateBodyParam, PostPublicV1CalendarCouponsUpdateResponse200, PostPublicV1CalendarCreatePersonTagBodyParam, PostPublicV1CalendarCreatePersonTagResponse200, PostPublicV1CalendarDeletePersonTagBodyParam, PostPublicV1CalendarDeletePersonTagResponse200, PostPublicV1CalendarImportPeopleBodyParam, PostPublicV1CalendarImportPeopleResponse200, PostPublicV1CalendarUpdatePersonTagBodyParam, PostPublicV1CalendarUpdatePersonTagResponse200, PostPublicV1EventAddGuestsBodyParam, PostPublicV1EventAddGuestsResponse200, PostPublicV1EventAddHostBodyParam, PostPublicV1EventAddHostResponse200, PostPublicV1EventCreateBodyParam, PostPublicV1EventCreateCouponBodyParam, PostPublicV1EventCreateCouponResponse200, PostPublicV1EventCreateResponse200, PostPublicV1EventSendInvitesBodyParam, PostPublicV1EventSendInvitesResponse200, PostPublicV1EventUpdateBodyParam, PostPublicV1EventUpdateCouponBodyParam, PostPublicV1EventUpdateCouponResponse200, PostPublicV1EventUpdateGuestStatusBodyParam, PostPublicV1EventUpdateGuestStatusResponse200, PostPublicV1EventUpdateResponse200, PostPublicV1ImagesCreateUploadUrlBodyParam, PostPublicV1ImagesCreateUploadUrlResponse200 } from './types';
