import { httpClient } from "../types";
import {Seat} from "../seat"

class ReservationController {
  bookingReference: string;
  seats: string[];
  trainId: string;
  httpClient: httpClient;

  constructor(
    bookingReference: string,
    seats: string[],
    trainId: string,
    httpClient: httpClient
  ) {
    this.bookingReference = bookingReference;
    this.seats = seats;
    this.trainId = trainId;
    this.httpClient = httpClient;
  }

  async reserve(trainId: string, seats: string[]) {

    let seatCount: number = seats.length
    // Step 1: get a booking reference
    let response = await this.httpClient.fetch("http://localhost:8082/booking_reference");
    const bookingReference = await response.text();

    // Step 2: fetch train data
    response = await fetch(`http://localhost:8081/data_for_train/${trainId}`);
    const train = await response.json();
    const seatsInTrain: Seat[] = Object.values(train.seats);

    // TODO: do not hard-code coach number
    const availableSeats = seatsInTrain
      .filter((s) => s.coach === "A")
      .filter((s) => !s.booking_reference);


    // Step 4: make reservation
    const toReserve = availableSeats.slice(0, seatCount);
    const seatIds = toReserve.map((s) => `${s.seat_number}${s.coach}`);
    const reservation = {
      booking_reference: bookingReference,
      seats: seatIds,
      train_id: trainId,
    };
    response = await fetch(`http://localhost:8081/reserve`, {
      method: "POST",
      body: JSON.stringify(reservation),
      headers: { "Content-Type": "application/json" },
    });
    return response;
  }
}

export { ReservationController };
