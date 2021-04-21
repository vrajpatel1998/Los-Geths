package main

import (
	"context"
	"encoding/json"
	"io/ioutil"
	"log"
	"strconv"
	"googlemaps.github.io/maps"
)

const IMG_COUNT  = 1
var   Production = false
const API_KEY    = ""

func GetList(params NewRoom) ([]Restaurant, map[string]int) {
	lat,  e1 := strconv.ParseFloat(params.Lat, 64)
	long, e2 := strconv.ParseFloat(params.Long, 64)
	var list []Restaurant
	if Production && e1 == nil && e2 == nil {
		origin := &maps.LatLng{
			Lat: lat,
			Lng: long,
		}
		list = performApiCalls(origin, params.MaxPrice)
	} else {
		list = returnMockedData()
	}


	voteMap := make(map[string]int)
	for _, id := range list {
		voteMap[id.ID] = 0
	}

	return list, voteMap
}

func returnMockedData() []Restaurant {

	restaurantList := make([]Restaurant, 20)

	dat, err := ioutil.ReadFile("MockedApiData/place-details.json")
	if err != nil {
		log.Fatalf("fatal error: %s", err)
	}
	placeDetails := make(map[string]maps.PlaceDetailsResult)
	err = json.Unmarshal(dat, &placeDetails)
	if err != nil {
		log.Fatalf("fatal error: %s", err)
	}
	i := 0
	for _, place := range placeDetails {

		imgDir := "MockedApiData/Images/" + place.PlaceID + "/"
		imgList := make([][]byte, IMG_COUNT)
		for i := 0; i < IMG_COUNT; i++ {
			imgPath := imgDir + "/" + strconv.Itoa(i) + ".jpeg"
			imgFile, err := ioutil.ReadFile(imgPath)
			if err != nil {
				continue
			}
			imgList[i] = imgFile
		}

		restaurant := Restaurant{
			ID:       place.PlaceID,
			Name:     place.Name,
			Location: place.FormattedAddress,
			Price:    place.PriceLevel,
			Rating:   place.Rating,
			ImgList:  imgList,
		}

		restaurantList[i] = restaurant
		i++
	}

	return restaurantList
}

func performApiCalls(latlng *maps.LatLng, maxPrice int) []Restaurant {

	// Create API client
	c, err := maps.NewClient(maps.WithAPIKey(API_KEY))
	restaurantList := make([]Restaurant, 20)
	if err != nil {
		log.Fatalf("fatal error102: %s", err)
	}
	// Assemble request
	r := &maps.NearbySearchRequest{
		Location: latlng,
		Radius:   15000,
		Type:     maps.PlaceTypeRestaurant,
		OpenNow:  true,
		MinPrice: maps.PriceLevelFree,
		MaxPrice: maps.PriceLevel(strconv.Itoa(maxPrice)),
	}

	// Perform the nearby search request.
	resp, err := c.NearbySearch(context.Background(), r)
	if err != nil {
		log.Fatalf("fatal error117: %s", err)
	}

	// Get the images for a restaurant
	// Sizes defined here can be changed or passed in.
	maxHeight := uint(500)
	maxWidth := uint(500)

	// Iterate through all restaurants returned
	for restaurantNum, restaurant := range resp.Results {

		imgList := make([][]byte, len(restaurant.Photos))
		for imgNum, imgRef := range restaurant.Photos {
			if imgNum > IMG_COUNT {
				break
			}
			// Request the image
			photoRequest := &maps.PlacePhotoRequest{
				PhotoReference: imgRef.PhotoReference,
				MaxHeight:      maxHeight,
				MaxWidth:       maxWidth,
			}

			photoResponse, err := c.PlacePhoto(context.Background(), photoRequest)
			b, err := ioutil.ReadAll(photoResponse.Data)
			if err != nil {
				log.Fatalf("fatal error 130: %s", err)
			}
			imgList[imgNum] = b
		}

		// Assemble restaurant and add to list
		restaurantList[restaurantNum] = Restaurant{
			ID:       restaurant.PlaceID,
			Name:     restaurant.Name,
			Location: restaurant.FormattedAddress,
			Price:    restaurant.PriceLevel,
			Rating:   restaurant.Rating,
			ImgList:  imgList,
		}

	}

	return restaurantList

}

// Performs a places details request for a restaurant's address. Used to get more details on winner
func GetRestaurantAddress(placeID string) string {
	// Create API client
	c, err := maps.NewClient(maps.WithAPIKey(API_KEY))

	// Define Place Details request.
	placeDetailsRequest := &maps.PlaceDetailsRequest{
		PlaceID: placeID,
	}

	// Perform request
	placeDetailsResp, err := c.PlaceDetails(context.Background(), placeDetailsRequest)
	if err != nil {
		log.Fatalf("fatal error: %s", err)
	}

	return placeDetailsResp.FormattedAddress
}
