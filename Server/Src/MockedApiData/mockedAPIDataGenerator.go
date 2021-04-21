package main

import (
	"context"
	"encoding/json"
	"io/ioutil"
	"log"
	"os"
	"strconv"

	"googlemaps.github.io/maps"

	"image/jpeg"
	_ "image/jpeg"
	_ "image/png"
)

// Just a little script demonstrating how to make various API calls to the places API.
// This stores the collected results in files to create a mocked data set.
func main() {
	c, err := maps.NewClient(maps.WithAPIKey("YOUR API KEY HERE"))
	if err != nil {
		log.Fatalf("fatal error: %s", err)
	}

	// Location is defined at a LatLng struct
	// This is just an aribtrary point defined to create dummy data
	origin := &maps.LatLng{
		Lat: 34.0416753,
		Lng: -118.4593532,
	}

	// Define the nearby search request.
	r := &maps.NearbySearchRequest{
		Location: origin,
		Radius:   1500,
		Type:     maps.PlaceTypeRestaurant,
		OpenNow:  true,
	}

	// Cam also add field to request like so
	r.MinPrice = maps.PriceLevelFree
	r.MaxPrice = maps.PriceLevelExpensive

	// Perform the nearby search request.
	resp, err := c.NearbySearch(context.Background(), r)
	if err != nil {
		log.Fatalf("fatal error: %s", err)
	}

	// Write the response of the request to a file
	nearbySearchResponseString, _ := json.Marshal(resp)
	err = ioutil.WriteFile("nearby-places.json", nearbySearchResponseString, 0644)
	if err != nil {
		log.Fatalf("fatal error: %s", err)
	}

	// for each location in results, perform a place details request to get further details and images
	placeDetailsMap := make(map[string]maps.PlaceDetailsResult)
	for _, restaurant := range resp.Results {
		placeID := restaurant.PlaceID

		// Define Place Details request.
		placeDetailsRequest := &maps.PlaceDetailsRequest{
			PlaceID: placeID,
		}

		// Perform request
		placeDetailsResp, err := c.PlaceDetails(context.Background(), placeDetailsRequest)
		if err != nil {
			log.Fatalf("fatal error: %s", err)
		}

		// Add result to a map
		placeDetailsMap[placeID] = placeDetailsResp

		// Write map to file.
		mapString, _ := json.Marshal(placeDetailsMap)
		err = ioutil.WriteFile("place-details.json", mapString, 0644)
		if err != nil {
			log.Fatalf("fatal error: %s", err)
		}

		// generate and store all images for a given place
		// This is a WIP due to not knowing the best format to provide images to the client.

		for imgNum, imageRef := range placeDetailsResp.Photos {
			maxHeight := uint(500)
			maxWidth := uint(500)
			photoRequest := &maps.PlacePhotoRequest{
				PhotoReference: imageRef.PhotoReference,
				MaxHeight:      maxHeight,
				MaxWidth:       maxWidth,
			}
			photoResponse, err := c.PlacePhoto(context.Background(), photoRequest)
			if err != nil {
				log.Fatalf("fatal error: %s", err)
			}
			img, err := photoResponse.Image()
			if err != nil {
				// log.Fatalf("fatal error Image(): %s", err)
				// This allows us on only display images with jpeg format.
				continue
			}
			// Save Image to JPEG (Can change later)
			// Make directory if it doesn't exist
			log.Print("Content Type: " + photoResponse.ContentType + "image ref " + imageRef.PhotoReference)
			if photoResponse.ContentType == "image/jpeg" {
				if _, err := os.Stat("Images/" + placeID + "/" + strconv.FormatInt(int64(imgNum), 10) + ".jpeg"); os.IsNotExist(err) {
					os.MkdirAll("Images/"+placeID, 0700)
				}

				f, err := os.Create("Images/" + placeID + "/" + strconv.FormatInt(int64(imgNum), 10) + ".jpeg")
				if err != nil {
					log.Fatalf("fatal error: %s", err)
				}
				defer f.Close()

				opt := jpeg.Options{
					Quality: 90,
				}

				err = jpeg.Encode(f, img, &opt)
				if err != nil {
					log.Fatalf("fatal error jpg: %s", err)
				}
				log.Print("wrote out image: " + "Images/" + placeID + "/" + strconv.FormatInt(int64(imgNum), 10) + ".jpeg")

			}

			// if photoResponse.ContentType == "image/png" {
			// 	if _, err := os.Stat("Images/" + placeID + "/" + strconv.FormatInt(int64(imgNum), 10) + ".png"); os.IsNotExist(err) {
			// 		os.MkdirAll("Images/"+placeID, 0700)
			// 	}

			// 	f, err := os.Create("Images/" + placeID + "/" + strconv.FormatInt(int64(imgNum), 10) + ".png")

			// 	if err != nil {
			// 		log.Fatalf("fatal error: %s", err)
			// 	}
			// 	defer f.Close()

			// 	err = png.Encode(f, img)
			// 	if err != nil {
			// 		log.Fatalf("fatal error jpg: %s", err)
			// 	}
			// 	log.Print("wrote out image: " + "Images/" + placeID + "/" + strconv.FormatInt(int64(imgNum), 10) + ".png")

			// }
			photoResponse.Data.Close()

		}

	}

}
